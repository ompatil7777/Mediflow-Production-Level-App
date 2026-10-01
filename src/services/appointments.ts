import { supabase } from '../lib/supabase';
import { store } from '../data/store';
import { Appointment, AppointmentSlot, PHC, PhcStatus } from '../types';

// ---------- helpers to map DB rows → app types ----------

function mapSlot(row: Record<string, unknown>): AppointmentSlot {
  return {
    id: row.id as string,
    phcId: row.phc_id as string,
    date: row.date as string,
    time: row.time as string,
    capacity: row.capacity as number,
    booked: row.booked as number,
  };
}

function mapAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    phcId: row.phc_id as string,
    phcName: row.phc_name as string,
    phcNameMr: row.phc_name_mr as string,
    patientId: row.patient_id as string,
    patientName: row.patient_name as string,
    tokenNo: row.token_no as number,
    date: row.date as string,
    time: row.time as string,
    careType: row.care_type as string,
    careTypeMr: row.care_type_mr as string,
    status: row.status as Appointment['status'],
    createdAt: row.created_at as string,
  };
}

function mapPhc(row: Record<string, unknown>): PHC {
  return {
    id: row.id as string,
    name: row.name as string,
    nameMr: row.name_mr as string,
    status: row.status as PhcStatus,
    statusReason: (row.status_reason as string) || undefined,
    statusReasonMr: (row.status_reason_mr as string) || undefined,
    doctorName: row.doctor_name as string,
    doctorNameMr: row.doctor_name_mr as string,
    hwName: row.hw_name as string,
    pharmacistName: row.pharmacist_name as string,
    phone: row.phone as string,
    lat: row.lat as number,
    lng: row.lng as number,
    taluka: row.taluka as string,
    district: row.district as string,
    openingHours: row.opening_hours as string,
    openingHoursMr: row.opening_hours_mr as string,
    assignedVillages: (row.assigned_villages as string[]) || [],
    updatedAt: row.updated_at as string,
  };
}

// ---------- service ----------

export const appointmentsService = {
  // ── PHC reads from Supabase ──────────────────────────────────────

  async getPhcs(): Promise<PHC[]> {
    const { data, error } = await supabase.from('phcs').select('*').order('name');
    if (error) throw error;
    return (data ?? []).map((r) => mapPhc(r as Record<string, unknown>));
  },

  async getPhc(id: string): Promise<PHC | undefined> {
    const { data, error } = await supabase
      .from('phcs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPhc(data as Record<string, unknown>) : undefined;
  },

  // ── Supabase reads ──────────────────────────────────────────────

  async getAppointments(phcId?: string, patientId?: string): Promise<Appointment[]> {
    let query = supabase
      .from('appointments')
      .select('*')
      .order('date')
      .order('time')
      .order('token_no');
    if (phcId) query = query.eq('phc_id', phcId);
    if (patientId) query = query.eq('patient_id', patientId);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapAppointment);
  },

  async getSlots(phcId: string, date: string): Promise<AppointmentSlot[]> {
    const { data, error } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('phc_id', phcId)
      .eq('date', date)
      .order('time');
    if (error) throw error;
    return (data ?? []).map(mapSlot);
  },

  async getAvailableDates(phcId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('appointment_slots')
      .select('date, booked, capacity')
      .eq('phc_id', phcId)
      .order('date');
    if (error) throw error;

    const availableDates = Array.from(
      new Set(
        (data ?? [])
          .filter((row) => (row.booked as number) < (row.capacity as number))
          .map((row) => row.date as string),
      ),
    ).sort();
    return availableDates;
  },

  // ── Supabase writes ─────────────────────────────────────────────

  async book_appointment(
    phcId: string,
    date: string,
    time: string,
    careType: string,
    careTypeMr: string,
    patientId: string,
    patientName: string,
  ): Promise<Appointment> {
    // 1. Find the slot for this PHC + date + time
    const { data: slotData, error: slotFetchErr } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('phc_id', phcId)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (slotFetchErr) throw slotFetchErr;

    const slot = slotData ? mapSlot(slotData as Record<string, unknown>) : null;

    // 2. Check for duplicate booking (same patient, same PHC, same date, same time)
    const { data: existing } = await supabase
      .from('appointments')
      .select('id')
      .eq('patient_id', patientId)
      .eq('phc_id', phcId)
      .eq('date', date)
      .eq('time', time)
      .neq('status', 'cancelled')
      .maybeSingle();

    if (existing) {
      throw new Error('You already have an appointment at this time. Please choose a different slot.');
    }

    // 3. Check slot capacity
    if (slot && slot.booked >= slot.capacity) {
      throw new Error('This time slot is fully booked. Please choose a different time.');
    }

    // 4. Find the health worker assigned to this slot's PHC
    const { data: hwData, error: hwErr } = await supabase
      .from('health_workers')
      .select('id')
      .eq('phc_id', phcId)
      .limit(1)
      .maybeSingle();

    if (hwErr) throw hwErr;

    const healthWorkerId = hwData?.id || null;

    // 5. Look up PHC name from database
    const phc = await this.getPhc(phcId);
    if (!phc) throw new Error('PHC not found');
    if (phc.status !== 'consulting') {
      throw new Error('This PHC is not currently accepting appointments.');
    }

    // 6. Calculate token number (count existing appointments for this PHC + date + 1)
    const { count: existingCount } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('phc_id', phcId)
      .eq('date', date)
      .neq('status', 'cancelled');

    const tokenNo = (existingCount ?? 0) + 1;

    // 7. Insert appointment
    const { data: aptRow, error: aptErr } = await supabase
      .from('appointments')
      .insert({
        phc_id: phcId,
        health_worker_id: healthWorkerId,
        phc_name: phc.name,
        phc_name_mr: phc.nameMr,
        patient_id: patientId,
        patient_name: patientName,
        token_no: tokenNo,
        date,
        time,
        care_type: careType,
        care_type_mr: careTypeMr,
        status: 'booked',
      })
      .select()
      .single();

    if (aptErr) {
      // Check for unique constraint violation (duplicate booking)
      if (aptErr.code === '23505') {
        throw new Error('This slot has just been booked. Please choose a different time.');
      }
      throw aptErr;
    }

    // 8. Increment slot.booked atomically
    if (slot) {
      await supabase
        .from('appointment_slots')
        .update({ booked: slot.booked + 1 })
        .eq('id', slot.id);
    }

    return mapAppointment(aptRow as Record<string, unknown>);
  },

  // PHC status still uses in-memory store (live status toggle)
  set_phc_status(phcId: string, status: PhcStatus, reason?: string, reasonMr?: string): void {
    store.set_phc_status(phcId, status, reason, reasonMr);
  },
};

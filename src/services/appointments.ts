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

// ---------- service ----------

export const appointmentsService = {
  // PHC data still lives in the in-memory store (not yet in Supabase)
  getPhcs(): PHC[] {
    return store.phcs;
  },

  getPhc(id: string): PHC | undefined {
    return store.phcs.find((p) => p.id === id);
  },

  // ── Supabase reads ──────────────────────────────────────────────

  async getAppointments(phcId?: string, patientId?: string): Promise<Appointment[]> {
    let query = supabase.from('appointments').select('*').order('date').order('time').order('token_no');
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
    // 1. Find the slot
    const { data: slotData, error: slotFetchErr } = await supabase
      .from('appointment_slots')
      .select('*')
      .eq('phc_id', phcId)
      .eq('date', date)
      .eq('time', time)
      .maybeSingle();

    if (slotFetchErr) throw slotFetchErr;

    const slot = slotData ? mapSlot(slotData as Record<string, unknown>) : null;
    const tokenNo = slot ? slot.booked + 1 : 1;

    // 2. Look up phcName from in-memory store (PHC table not yet in Supabase)
    const phc = store.phcs.find((p) => p.id === phcId) || store.phcs[0];

    // 3. Insert appointment
    const { data: aptRow, error: aptErr } = await supabase
      .from('appointments')
      .insert({
        phc_id: phcId,
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
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (aptErr) throw aptErr;

    // 4. Increment slot.booked
    if (slot) {
      await supabase
        .from('appointment_slots')
        .update({ booked: slot.booked + 1 })
        .eq('id', slot.id);
    }

    return mapAppointment(aptRow as Record<string, unknown>);
  },

  // PHC status still uses in-memory store
  set_phc_status(phcId: string, status: PhcStatus, reason?: string, reasonMr?: string): void {
    store.set_phc_status(phcId, status, reason, reasonMr);
  },
};

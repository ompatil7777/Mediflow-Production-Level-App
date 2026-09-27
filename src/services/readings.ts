import { supabase } from '../lib/supabase';
import { HealthReading, Patient } from '../types';

// ---------- helpers to map DB rows → app types ----------

function mapPatient(row: Record<string, unknown>): Patient {
  const chronic = (row.chronic_conditions as string[] | null) ?? [];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    fullName: row.full_name as string,
    fullNameMr: row.full_name_mr as string,
    mobile: row.mobile as string,
    age: row.age as number,
    gender: row.gender as Patient['gender'],
    genderMr: row.gender_mr as string,
    villageId: row.village_id as string,
    villageName: row.village_name as string,
    villageNameMr: row.village_name_mr as string,
    assignedPhcId: row.assigned_phc_id as string,
    assignedPhcName: row.assigned_phc_name as string,
    assignedPhcNameMr: row.assigned_phc_name_mr as string,
    emergencyContact: row.emergency_contact as string,
    consent: row.consent as boolean,
    chronicConditions: chronic,
    chronicConditionsMr: chronic, // DB only stores English; localisation is applied in UI
    createdAt: row.created_at as string,
  };
}

function mapReading(row: Record<string, unknown>): HealthReading {
  return {
    id: row.id as string,
    patientId: row.patient_id as string,
    type: row.type as HealthReading['type'],
    systolic: row.systolic as number | undefined,
    diastolic: row.diastolic as number | undefined,
    glucose: row.glucose as number | undefined,
    readingType: row.reading_type as HealthReading['readingType'],
    statusLabel: row.status_label as string,
    statusLabelMr: row.status_label_mr as string,
    recordedBy: row.recorded_by as string,
    recordedRole: row.recorded_role as HealthReading['recordedRole'],
    recordedAt: row.recorded_at as string,
  };
}

// ---------- service ----------

export const readingsService = {
  async getPatients(phcId?: string): Promise<Patient[]> {
    let query = supabase.from('patients').select('*').order('full_name');
    if (phcId) query = query.eq('assigned_phc_id', phcId);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapPatient);
  },

  async getPatient(id: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? mapPatient(data as Record<string, unknown>) : undefined;
  },

  async getReadings(patientId?: string): Promise<HealthReading[]> {
    let query = supabase
      .from('health_readings')
      .select('*')
      .order('recorded_at', { ascending: false });
    if (patientId) query = query.eq('patient_id', patientId);

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapReading);
  },

  async record_reading(reading: Omit<HealthReading, 'id' | 'recordedAt'>): Promise<HealthReading> {
    const { data, error } = await supabase
      .from('health_readings')
      .insert({
        patient_id: reading.patientId,
        type: reading.type,
        systolic: reading.systolic ?? null,
        diastolic: reading.diastolic ?? null,
        glucose: reading.glucose ?? null,
        reading_type: reading.readingType ?? null,
        status_label: reading.statusLabel,
        status_label_mr: reading.statusLabelMr,
        recorded_by: reading.recordedBy,
        recorded_role: reading.recordedRole,
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return mapReading(data as Record<string, unknown>);
  },
};

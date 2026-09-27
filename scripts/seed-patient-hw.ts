import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { MOCK_PATIENTS, MOCK_HEALTH_READINGS, MOCK_APPOINTMENTS } from '../src/data/mockData';

if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch (e) {
    console.warn('Could not auto-load .env:', e);
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Generate slots for today and next 5 days
function generateSlots() {
  const times = ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'];
  const phcIds = ['phc-shivapur', 'phc-rampur', 'phc-kanhegaon', 'phc-wadgaon', 'phc-nimgaon', 'phc-pathri'];
  const slots: Array<{
    id: string;
    phc_id: string;
    date: string;
    time: string;
    capacity: number;
    booked: number;
  }> = [];

  const today = new Date();
  for (let d = 0; d < 6; d++) {
    const curr = new Date(today);
    curr.setDate(today.getDate() + d);
    const dateStr = curr.toISOString().split('T')[0];

    for (const phcId of phcIds) {
      for (const t of times) {
        slots.push({
          id: crypto.randomUUID(),
          phc_id: phcId,
          date: dateStr,
          time: t,
          capacity: 10,
          booked: d === 0 ? 3 : 1,
        });
      }
    }
  }
  return slots;
}

const slotsData = generateSlots();

const patientsData = MOCK_PATIENTS.map((p) => ({
  id: p.id,
  user_id: p.userId,
  full_name: p.fullName,
  full_name_mr: p.fullNameMr,
  mobile: p.mobile,
  age: p.age,
  gender: p.gender,
  gender_mr: p.genderMr,
  village_id: p.villageId,
  village_name: p.villageName,
  village_name_mr: p.villageNameMr,
  assigned_phc_id: p.assignedPhcId,
  assigned_phc_name: p.assignedPhcName,
  assigned_phc_name_mr: p.assignedPhcNameMr,
  emergency_contact: p.emergencyContact,
  consent: p.consent,
  chronic_conditions: p.chronicConditions,
  created_at: p.createdAt,
}));

const readingsData = MOCK_HEALTH_READINGS.map((r) => ({
  id: crypto.randomUUID(),
  patient_id: r.patientId,
  type: r.type,
  systolic: r.systolic ?? null,
  diastolic: r.diastolic ?? null,
  glucose: r.glucose ?? null,
  reading_type: r.readingType ?? null,
  status_label: r.statusLabel,
  status_label_mr: r.statusLabelMr,
  recorded_by: r.recordedBy,
  recorded_role: r.recordedRole,
  recorded_at: r.recordedAt,
}));

const appointmentsData = MOCK_APPOINTMENTS.map((a) => ({
  id: crypto.randomUUID(),
  phc_id: a.phcId,
  phc_name: a.phcName,
  phc_name_mr: a.phcNameMr,
  patient_id: a.patientId,
  patient_name: a.patientName,
  token_no: a.tokenNo,
  date: a.date,
  time: a.time,
  care_type: a.careType,
  care_type_mr: a.careTypeMr,
  status: a.status,
  created_at: a.createdAt,
}));

function generateSql() {
  const lines: string[] = ['-- MediFlow+ Patient and Health Worker Seed & Policy Script\n'];

  // Add Policies
  lines.push('-- 1. Enable RLS access for both authenticated and anon roles during development');
  lines.push(`
DO $$
BEGIN
  -- appointment_slots policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointment_slots' AND policyname = 'allow_all_slots') THEN
    CREATE POLICY allow_all_slots ON appointment_slots FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- appointments policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'allow_all_appointments') THEN
    CREATE POLICY allow_all_appointments ON appointments FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- health_readings policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'health_readings' AND policyname = 'allow_all_readings') THEN
    CREATE POLICY allow_all_readings ON health_readings FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;

  -- patients policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'patients' AND policyname = 'allow_all_patients') THEN
    CREATE POLICY allow_all_patients ON patients FOR ALL TO public USING (true) WITH CHECK (true);
  END IF;
END $$;
`);

  // Patients
  lines.push('\n-- 2. Patients');
  for (const p of patientsData) {
    const esc = (s: any) => (s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`);
    const chronic = `ARRAY[${p.chronic_conditions.map((c) => `'${c.replace(/'/g, "''")}'`).join(', ')}]`;
    lines.push(
      `INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) ` +
        `VALUES (${esc(p.id)}, ${esc(p.user_id)}, ${esc(p.full_name)}, ${esc(p.full_name_mr)}, ${esc(p.mobile)}, ${p.age}, ${esc(p.gender)}, ${esc(p.gender_mr)}, ${esc(p.village_id)}, ${esc(p.village_name)}, ${esc(p.village_name_mr)}, ${esc(p.assigned_phc_id)}, ${esc(p.assigned_phc_name)}, ${esc(p.assigned_phc_name_mr)}, ${esc(p.emergency_contact)}, ${p.consent}, ${chronic}, ${esc(p.created_at)}) ` +
        `ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;`
    );
  }

  // Appointment Slots
  lines.push('\n-- 3. Appointment Slots');
  for (const s of slotsData) {
    const esc = (str: string) => `'${str.replace(/'/g, "''")}'`;
    lines.push(
      `INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) ` +
        `VALUES (${esc(s.id)}, ${esc(s.phc_id)}, ${esc(s.date)}, ${esc(s.time)}, ${s.capacity}, ${s.booked});`
    );
  }

  // Health Readings
  lines.push('\n-- 4. Initial Health Readings');
  for (const r of readingsData) {
    const esc = (str: any) => (str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`);
    lines.push(
      `INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) ` +
        `VALUES (${esc(r.id)}, ${esc(r.patient_id)}, ${esc(r.type)}, ${r.systolic ?? 'NULL'}, ${r.diastolic ?? 'NULL'}, ${r.glucose ?? 'NULL'}, ${esc(r.reading_type)}, ${esc(r.status_label)}, ${esc(r.status_label_mr)}, ${esc(r.recorded_by)}, ${esc(r.recorded_role)}, ${esc(r.recorded_at)});`
    );
  }

  // Initial Appointments
  lines.push('\n-- 5. Initial Appointments');
  for (const a of appointmentsData) {
    const esc = (str: string) => `'${str.replace(/'/g, "''")}'`;
    lines.push(
      `INSERT INTO appointments (id, phc_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at) ` +
        `VALUES (${esc(a.id)}, ${esc(a.phc_id)}, ${esc(a.phc_name)}, ${esc(a.phc_name_mr)}, ${esc(a.patient_id)}, ${esc(a.patient_name)}, ${a.token_no}, ${esc(a.date)}, ${esc(a.time)}, ${esc(a.care_type)}, ${esc(a.care_type_mr)}, ${esc(a.status)}, ${esc(a.created_at)});`
    );
  }

  const filePath = path.resolve('supabase/seed_patient_hw.sql');
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Generated SQL at: ${filePath}`);
}

async function run() {
  generateSql();
}

run();

import * as fs from 'fs';
import * as path from 'path';

// Generate slots for today and next 5 days
function generateSlots() {
  const times = ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM'];
  const phcIds = ['phc-shivapur', 'phc-rampur', 'phc-kanhegaon', 'phc-wadgaon', 'phc-nimgaon', 'phc-pathri'];
  const slots = [];

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

const patientsData = [
  {
    id: 'MF-P-0001',
    user_id: 'user-patient',
    full_name: 'Ramesh Patil',
    full_name_mr: 'रमेश पाटील',
    mobile: '9876543210',
    age: 54,
    gender: 'M',
    gender_mr: 'पुरुष',
    village_id: 'vil-2',
    village_name: 'Shivapur',
    village_name_mr: 'शिवापूर',
    assigned_phc_id: 'phc-shivapur',
    assigned_phc_name: 'PHC Shivapur',
    assigned_phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    emergency_contact: '0000 000000',
    consent: true,
    chronic_conditions: ['Type 2 Diabetes', 'Hypertension'],
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'MF-P-0002',
    user_id: 'usr-anita-p',
    full_name: 'Anandi Bai Shinde',
    full_name_mr: 'आनंदी बाई शिंदे',
    mobile: '9876543220',
    age: 62,
    gender: 'F',
    gender_mr: 'महिला',
    village_id: 'vil-2',
    village_name: 'Shivapur',
    village_name_mr: 'शिवापूर',
    assigned_phc_id: 'phc-shivapur',
    assigned_phc_name: 'PHC Shivapur',
    assigned_phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    emergency_contact: '0000 000000',
    consent: true,
    chronic_conditions: ['Hypertension'],
    created_at: '2026-08-12T11:00:00Z',
  },
  {
    id: 'MF-P-0003',
    user_id: 'usr-santosh',
    full_name: 'Santosh Jadhav',
    full_name_mr: 'संतोष जाधव',
    mobile: '9876543221',
    age: 48,
    gender: 'M',
    gender_mr: 'पुरुष',
    village_id: 'vil-2',
    village_name: 'Shivapur',
    village_name_mr: 'शिवापूर',
    assigned_phc_id: 'phc-shivapur',
    assigned_phc_name: 'PHC Shivapur',
    assigned_phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    emergency_contact: '0000 000000',
    consent: true,
    chronic_conditions: ['Type 2 Diabetes'],
    created_at: '2026-08-14T09:30:00Z',
  },
  {
    id: 'MF-P-0004',
    user_id: 'usr-kamal',
    full_name: 'Kamal Bai Gaikwad',
    full_name_mr: 'कमल बाई गायकवाड',
    mobile: '9876543222',
    age: 58,
    gender: 'F',
    gender_mr: 'महिला',
    village_id: 'vil-3',
    village_name: 'Kanhegaon',
    village_name_mr: 'कान्हेगाव',
    assigned_phc_id: 'phc-kanhegaon',
    assigned_phc_name: 'PHC Kanhegaon',
    assigned_phc_name_mr: 'प्रा. आ. केंद्र कान्हेगाव',
    emergency_contact: '0000 000000',
    consent: true,
    chronic_conditions: ['Hypertension'],
    created_at: '2026-08-15T14:20:00Z',
  },
  {
    id: 'MF-P-0005',
    user_id: 'usr-vitthal',
    full_name: 'Vitthal Kadam',
    full_name_mr: 'विठ्ठल कदम',
    mobile: '9876543223',
    age: 65,
    gender: 'M',
    gender_mr: 'पुरुष',
    village_id: 'vil-2',
    village_name: 'Shivapur',
    village_name_mr: 'शिवापूर',
    assigned_phc_id: 'phc-shivapur',
    assigned_phc_name: 'PHC Shivapur',
    assigned_phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    emergency_contact: '0000 000000',
    consent: true,
    chronic_conditions: ['Hypertension', 'Joint Pain'],
    created_at: '2026-08-16T10:15:00Z',
  },
];

const readingsData = [
  {
    id: crypto.randomUUID(),
    patient_id: 'MF-P-0001',
    type: 'bp',
    systolic: 128,
    diastolic: 82,
    glucose: null,
    reading_type: null,
    status_label: 'Within recorded target range',
    status_label_mr: 'नोंदवलेल्या मर्यादेत',
    recorded_by: 'Sunita Gaikwad (ANM)',
    recorded_role: 'health_worker',
    recorded_at: '2026-09-18T10:30:00Z',
  },
  {
    id: crypto.randomUUID(),
    patient_id: 'MF-P-0001',
    type: 'sugar',
    systolic: null,
    diastolic: null,
    glucose: 136,
    reading_type: 'fasting',
    status_label: 'Within recorded target range',
    status_label_mr: 'नोंदवलेल्या मर्यादेत',
    recorded_by: 'Sunita Gaikwad (ANM)',
    recorded_role: 'health_worker',
    recorded_at: '2026-09-18T10:35:00Z',
  },
  {
    id: crypto.randomUUID(),
    patient_id: 'MF-P-0001',
    type: 'bp',
    systolic: 142,
    diastolic: 88,
    glucose: null,
    reading_type: null,
    status_label: 'Needs attention',
    status_label_mr: 'लक्ष देणे आवश्यक',
    recorded_by: 'Ramesh Patil (Self)',
    recorded_role: 'patient',
    recorded_at: '2026-09-10T08:15:00Z',
  },
  {
    id: crypto.randomUUID(),
    patient_id: 'MF-P-0001',
    type: 'sugar',
    systolic: null,
    diastolic: null,
    glucose: 172,
    reading_type: 'post_meal',
    status_label: 'Needs attention',
    status_label_mr: 'लक्ष देणे आवश्यक',
    recorded_by: 'Ramesh Patil (Self)',
    recorded_role: 'patient',
    recorded_at: '2026-09-10T14:30:00Z',
  },
];

const appointmentsData = [
  {
    id: crypto.randomUUID(),
    phc_id: 'phc-shivapur',
    phc_name: 'PHC Shivapur',
    phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    patient_id: 'MF-P-0001',
    patient_name: 'Ramesh Patil',
    token_no: 4,
    date: new Date().toISOString().split('T')[0],
    time: '09:30 AM',
    care_type: 'Chronic Disease Follow-up',
    care_type_mr: 'दीर्घकालीन आजार पाठपुरावा',
    status: 'booked',
    created_at: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    phc_id: 'phc-shivapur',
    phc_name: 'PHC Shivapur',
    phc_name_mr: 'प्रा. आ. केंद्र शिवापूर',
    patient_id: 'MF-P-0002',
    patient_name: 'Anandi Bai Shinde',
    token_no: 5,
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    care_type: 'Blood Pressure Check',
    care_type_mr: 'रक्तदाब तपासणी',
    status: 'checked_in',
    created_at: new Date().toISOString(),
  },
];

function generateSql() {
  const lines = ['-- MediFlow+ Patient and Health Worker Seed & Policy Script\n'];

  // Add Policies
  lines.push('-- 1. Enable RLS access for public (authenticated + anon) during development');
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
    const esc = (s) => (s === null || s === undefined ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`);
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
    const esc = (str) => `'${str.replace(/'/g, "''")}'`;
    lines.push(
      `INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) ` +
        `VALUES (${esc(s.id)}, ${esc(s.phc_id)}, ${esc(s.date)}, ${esc(s.time)}, ${s.capacity}, ${s.booked});`
    );
  }

  // Health Readings
  lines.push('\n-- 4. Initial Health Readings');
  for (const r of readingsData) {
    const esc = (str) => (str === null || str === undefined ? 'NULL' : `'${String(str).replace(/'/g, "''")}'`);
    lines.push(
      `INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) ` +
        `VALUES (${esc(r.id)}, ${esc(r.patient_id)}, ${esc(r.type)}, ${r.systolic ?? 'NULL'}, ${r.diastolic ?? 'NULL'}, ${r.glucose ?? 'NULL'}, ${esc(r.reading_type)}, ${esc(r.status_label)}, ${esc(r.status_label_mr)}, ${esc(r.recorded_by)}, ${esc(r.recorded_role)}, ${esc(r.recorded_at)});`
    );
  }

  // Initial Appointments
  lines.push('\n-- 5. Initial Appointments');
  for (const a of appointmentsData) {
    const esc = (str) => `'${str.replace(/'/g, "''")}'`;
    lines.push(
      `INSERT INTO appointments (id, phc_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at) ` +
        `VALUES (${esc(a.id)}, ${esc(a.phc_id)}, ${esc(a.phc_name)}, ${esc(a.phc_name_mr)}, ${esc(a.patient_id)}, ${esc(a.patient_name)}, ${a.token_no}, ${esc(a.date)}, ${esc(a.time)}, ${esc(a.care_type)}, ${esc(a.care_type_mr)}, ${esc(a.status)}, ${esc(a.created_at)});`
    );
  }

  const filePath = path.resolve('supabase/seed_patient_hw.sql');
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Generated SQL at: ${filePath}`);
}

generateSql();

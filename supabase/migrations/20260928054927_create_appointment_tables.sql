/*
# Create core tables for MediFlow+ appointment & patient care flow

## Purpose
Creates the database tables needed for the patient-to-health-worker appointment loop:
PHCs, health worker assignments, patients, health readings, appointment slots,
and appointments — plus seed data and RLS policies.

## New Tables

1. phcs — Primary Health Centres (id, name, name_mr, status, doctor info, etc.)
2. health_workers — Health workers assigned to PHCs (id, phc_id, full_name, etc.)
3. patients — Patients registered at a PHC (id, user_id, full_name, phc_id, etc.)
4. health_readings — BP/sugar readings for patients
5. appointment_slots — Available time slots per PHC per date
6. appointments — Booked appointments linking patient → PHC → health worker

## RLS Policies
- This is a demo app with NO Supabase Auth sign-in (uses a demo role switcher).
- All tables use `TO anon, authenticated` so the anon-key frontend can read/write.
- RLS is enabled on every table but policies allow public CRUD for demo purposes.

## Seed Data
- 6 PHCs (Shivapur, Rampur, Kanhegaon, Wadgaon, Nimgaon, Pathri)
- Health workers assigned to each PHC
- 5 patients at Shivapur, 2 at Rampur
- 4 health readings for patient MF-P-0001
- Appointment slots for today + next 7 days across multiple PHCs
- 2 pre-existing appointments for demo queue
*/

-- ============================================================
-- 1. PHCS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS phcs (
  id text PRIMARY KEY,
  name text NOT NULL,
  name_mr text NOT NULL,
  status text NOT NULL DEFAULT 'consulting',
  status_reason text,
  status_reason_mr text,
  doctor_name text NOT NULL,
  doctor_name_mr text NOT NULL,
  hw_name text NOT NULL,
  pharmacist_name text NOT NULL,
  phone text NOT NULL DEFAULT '0000 000000',
  lat numeric NOT NULL DEFAULT 0,
  lng numeric NOT NULL DEFAULT 0,
  taluka text NOT NULL,
  district text NOT NULL,
  opening_hours text NOT NULL,
  opening_hours_mr text NOT NULL,
  assigned_villages text[] NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE phcs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_phcs" ON phcs;
CREATE POLICY "anon_select_phcs" ON phcs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_phcs" ON phcs;
CREATE POLICY "anon_insert_phcs" ON phcs FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_phcs" ON phcs;
CREATE POLICY "anon_update_phcs" ON phcs FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_phcs" ON phcs;
CREATE POLICY "anon_delete_phcs" ON phcs FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 2. HEALTH WORKERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS health_workers (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  phc_id text NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  full_name_mr text NOT NULL,
  role text NOT NULL DEFAULT 'health_worker',
  phone text NOT NULL DEFAULT '0000 000000',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_workers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_health_workers" ON health_workers;
CREATE POLICY "anon_select_health_workers" ON health_workers FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_health_workers" ON health_workers;
CREATE POLICY "anon_insert_health_workers" ON health_workers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_health_workers" ON health_workers;
CREATE POLICY "anon_update_health_workers" ON health_workers FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_health_workers" ON health_workers;
CREATE POLICY "anon_delete_health_workers" ON health_workers FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 3. PATIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS patients (
  id text PRIMARY KEY,
  user_id text NOT NULL,
  full_name text NOT NULL,
  full_name_mr text NOT NULL,
  mobile text NOT NULL DEFAULT '0000 000000',
  age integer NOT NULL DEFAULT 0,
  gender text NOT NULL DEFAULT 'M',
  gender_mr text NOT NULL DEFAULT 'पुरुष',
  village_id text,
  village_name text,
  village_name_mr text,
  assigned_phc_id text NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
  assigned_phc_name text NOT NULL,
  assigned_phc_name_mr text NOT NULL,
  emergency_contact text NOT NULL DEFAULT '0000 000000',
  consent boolean NOT NULL DEFAULT true,
  chronic_conditions text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patients" ON patients;
CREATE POLICY "anon_select_patients" ON patients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_patients" ON patients;
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_patients" ON patients;
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_patients" ON patients;
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 4. HEALTH READINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS health_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  type text NOT NULL,
  systolic integer,
  diastolic integer,
  glucose integer,
  reading_type text,
  status_label text NOT NULL,
  status_label_mr text NOT NULL,
  recorded_by text NOT NULL,
  recorded_role text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE health_readings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_health_readings" ON health_readings;
CREATE POLICY "anon_select_health_readings" ON health_readings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_health_readings" ON health_readings;
CREATE POLICY "anon_insert_health_readings" ON health_readings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_health_readings" ON health_readings;
CREATE POLICY "anon_update_health_readings" ON health_readings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_health_readings" ON health_readings;
CREATE POLICY "anon_delete_health_readings" ON health_readings FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 5. APPOINTMENT SLOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phc_id text NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
  health_worker_id text REFERENCES health_workers(id) ON DELETE SET NULL,
  date text NOT NULL,
  time text NOT NULL,
  capacity integer NOT NULL DEFAULT 10,
  booked integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Prevent duplicate slot for same PHC + worker + date + time
CREATE UNIQUE INDEX IF NOT EXISTS appointment_slots_unique_idx
  ON appointment_slots (phc_id, health_worker_id, date, time);

ALTER TABLE appointment_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointment_slots" ON appointment_slots;
CREATE POLICY "anon_select_appointment_slots" ON appointment_slots FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointment_slots" ON appointment_slots;
CREATE POLICY "anon_insert_appointment_slots" ON appointment_slots FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointment_slots" ON appointment_slots;
CREATE POLICY "anon_update_appointment_slots" ON appointment_slots FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointment_slots" ON appointment_slots;
CREATE POLICY "anon_delete_appointment_slots" ON appointment_slots FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- 6. APPOINTMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phc_id text NOT NULL REFERENCES phcs(id) ON DELETE CASCADE,
  health_worker_id text REFERENCES health_workers(id) ON DELETE SET NULL,
  phc_name text NOT NULL,
  phc_name_mr text NOT NULL,
  patient_id text NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  token_no integer NOT NULL DEFAULT 1,
  date text NOT NULL,
  time text NOT NULL,
  care_type text NOT NULL,
  care_type_mr text NOT NULL,
  status text NOT NULL DEFAULT 'booked',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent the same patient from booking the same PHC+date+time twice
CREATE UNIQUE INDEX IF NOT EXISTS appointments_patient_unique_idx
  ON appointments (patient_id, phc_id, date, time)
  WHERE status NOT IN ('cancelled');

-- Prevent double-booking a specific worker slot (one patient per worker per slot)
CREATE UNIQUE INDEX IF NOT EXISTS appointments_worker_slot_unique_idx
  ON appointments (health_worker_id, date, time)
  WHERE status NOT IN ('cancelled') AND health_worker_id IS NOT NULL;

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

-- ============================================================
-- SEED DATA: PHCs
-- ============================================================
INSERT INTO phcs (id, name, name_mr, status, doctor_name, doctor_name_mr, hw_name, pharmacist_name, lat, lng, taluka, district, opening_hours, opening_hours_mr, assigned_villages, updated_at) VALUES
('phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', 'consulting', 'Dr. Anita Deshmukh', 'डॉ. अनिता देशमुख', 'Sunita Gaikwad', 'Ganesh Jadhav', 18.5204, 73.8567, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Shivapur,Kanhegaon}', now()),
('phc-rampur', 'PHC Rampur', 'प्रा. आ. केंद्र रामपूर', 'consulting', 'Dr. Suresh Shinde', 'डॉ. सुरेश शिंदे', 'Anusaya More', 'Vikas Kadam', 18.5304, 73.8667, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Rampur}', now()),
('phc-kanhegaon', 'PHC Kanhegaon', 'प्रा. आ. केंद्र कान्हेगाव', 'paused', 'Dr. Rahul Wagh', 'डॉ. राहुल वाघ', 'Shobha Kamble', 'Deepak Thorat', 18.5104, 73.8467, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Kanhegaon}', now()),
('phc-wadgaon', 'PHC Wadgaon', 'प्रा. आ. केंद्र वडगाव', 'consulting', 'Dr. Priya Sonawane', 'डॉ. प्रिया सोनावणे', 'Kavita Salve', 'Mahesh Gite', 18.5404, 73.8767, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Wadgaon}', now()),
('phc-nimgaon', 'PHC Nimgaon', 'प्रा. आ. केंद्र निमगाव', 'consulting', 'Dr. Sandeep Mane', 'डॉ. संदीप माने', 'Mangal Bhoite', 'Ajay Kute', 18.5004, 73.8367, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Nimgaon}', now()),
('phc-pathri', 'PHC Pathri', 'प्रा. आ. केंद्र पाथरी', 'consulting', 'Dr. Kavita Joshi', 'डॉ. कविता जोशी', 'Rekha Jagtap', 'Nilesh Darekar', 18.5504, 73.8867, 'Rampur Taluka', 'Demo District', '09:00 AM - 05:00 PM', 'सकाळी ०९:०० ते संध्याकाळी ०५:००', '{Pathri}', now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: Health Workers (assigned to PHCs)
-- ============================================================
INSERT INTO health_workers (id, user_id, phc_id, full_name, full_name_mr, role, phone) VALUES
('hw-sunita', 'usr-sunita', 'phc-shivapur', 'Sunita Gaikwad', 'सुनिता गायकवाड', 'health_worker', '9876543211'),
('hw-anusaya', 'usr-anusaya', 'phc-rampur', 'Anusaya More', 'अनुसया मोरे', 'health_worker', '9876543215'),
('hw-shobha', 'usr-shobha', 'phc-kanhegaon', 'Shobha Kamble', 'शोभा कांबळे', 'health_worker', '9876543216'),
('hw-kavita-s', 'usr-kavita-s', 'phc-wadgaon', 'Kavita Salve', 'कविता साळवे', 'health_worker', '9876543217'),
('hw-mangal', 'usr-mangal', 'phc-nimgaon', 'Mangal Bhoite', 'मंगल भोईत', 'health_worker', '9876543218'),
('hw-rekha', 'usr-rekha', 'phc-pathri', 'Rekha Jagtap', 'रेखा जगताप', 'health_worker', '9876543219')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: Patients
-- ============================================================
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES
('MF-P-0001', 'usr-ramesh', 'Ramesh Patil', 'रमेश पाटील', '9876543210', 54, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, '{Type 2 Diabetes,Hypertension}', '2026-08-10T10:00:00Z'),
('MF-P-0002', 'usr-anita-p', 'Anandi Bai Shinde', 'आनंदी बाई शिंदे', '9876543220', 62, 'F', 'महिला', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, '{Hypertension}', '2026-08-12T11:00:00Z'),
('MF-P-0003', 'usr-santosh', 'Santosh Jadhav', 'संतोष जाधव', '9876543221', 48, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, '{Type 2 Diabetes}', '2026-08-14T09:30:00Z'),
('MF-P-0004', 'usr-rukmini', 'Rukmini Kadam', 'रुक्मिणी कदम', '9876543222', 39, 'F', 'महिला', 'vil-3', 'Kanhegaon', 'कान्हेगाव', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, '{Iron Deficiency Anemia}', '2026-08-15T14:00:00Z'),
('MF-P-0005', 'usr-dnyaneshwar', 'Dnyaneshwar More', 'ज्ञानेश्वर मोरे', '9876543223', 67, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, '{Hypertension,Joint Pain}', '2026-08-16T10:15:00Z'),
('MF-P-0006', 'usr-prakash', 'Prakash Deshmukh', 'प्रकाश देशमुख', '9876543224', 58, 'M', 'पुरुष', 'vil-1', 'Rampur', 'रामपूर', 'phc-rampur', 'PHC Rampur', 'प्रा. आ. केंद्र रामपूर', '0000 000000', true, '{Type 2 Diabetes}', '2026-08-18T09:00:00Z'),
('MF-P-0007', 'usr-sunita-p', 'Sunita Kale', 'सुनिता काळे', '9876543225', 45, 'F', 'महिला', 'vil-1', 'Rampur', 'रामपूर', 'phc-rampur', 'PHC Rampur', 'प्रा. आ. केंद्र रामपूर', '0000 000000', true, '{Hypertension}', '2026-08-20T12:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED DATA: Health Readings for MF-P-0001
-- ============================================================
INSERT INTO health_readings (patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) VALUES
('MF-P-0001', 'bp', 128, 82, null, null, 'Within recorded target range', 'नोंदवलेल्या मर्यादेत', 'Sunita Gaikwad (ANM)', 'health_worker', '2026-09-18T10:30:00Z'),
('MF-P-0001', 'sugar', null, null, 136, 'fasting', 'Within recorded target range', 'नोंदवलेल्या मर्यादेत', 'Sunita Gaikwad (ANM)', 'health_worker', '2026-09-18T10:35:00Z'),
('MF-P-0001', 'bp', 142, 88, null, null, 'Needs attention', 'लक्ष देणे आवश्यक', 'Ramesh Patil (Self)', 'patient', '2026-09-10T08:15:00Z'),
('MF-P-0001', 'sugar', null, null, 172, 'post_meal', 'Needs attention', 'लक्ष देणे आवश्यक', 'Ramesh Patil (Self)', 'patient', '2026-09-10T14:30:00Z')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA: Appointment Slots
-- Generate slots for today + 7 days across multiple PHCs
-- ============================================================

-- Delete old slots before inserting fresh ones
DELETE FROM appointment_slots;

-- Generate 3 slots per day per PHC for today + next 7 days
-- Using a DO block to generate dates dynamically
DO $$
DECLARE
  d integer;
  slot_time text;
  phc_record RECORD;
  hw_record RECORD;
  slot_date text;
BEGIN
  FOR d IN 0..7 LOOP
    slot_date := to_char(CURRENT_DATE + d, 'YYYY-MM-DD');
    
    FOR phc_record IN SELECT id, name FROM phcs WHERE status = 'consulting' LOOP
      -- Get the health worker for this PHC
      SELECT id INTO hw_record FROM health_workers WHERE phc_id = phc_record.id LIMIT 1;
      
      -- Slot 1: 09:30 AM
      INSERT INTO appointment_slots (phc_id, health_worker_id, date, time, capacity, booked)
      VALUES (phc_record.id, hw_record.id, slot_date, '09:30 AM', 10, 0)
      ON CONFLICT (phc_id, health_worker_id, date, time) DO NOTHING;
      
      -- Slot 2: 11:00 AM
      INSERT INTO appointment_slots (phc_id, health_worker_id, date, time, capacity, booked)
      VALUES (phc_record.id, hw_record.id, slot_date, '11:00 AM', 10, 0)
      ON CONFLICT (phc_id, health_worker_id, date, time) DO NOTHING;
      
      -- Slot 3: 02:00 PM
      INSERT INTO appointment_slots (phc_id, health_worker_id, date, time, capacity, booked)
      VALUES (phc_record.id, hw_record.id, slot_date, '02:00 PM', 10, 0)
      ON CONFLICT (phc_id, health_worker_id, date, time) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- ============================================================
-- SEED DATA: Pre-existing appointments for demo queue
-- ============================================================
-- Clear old appointments
DELETE FROM appointments;

-- Insert 2 pre-existing appointments at Shivapur for today
INSERT INTO appointments (phc_id, health_worker_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at)
SELECT
  'phc-shivapur',
  'hw-sunita',
  'PHC Shivapur',
  'प्रा. आ. केंद्र शिवापूर',
  'MF-P-0002',
  'Anandi Bai Shinde',
  1,
  to_char(CURRENT_DATE, 'YYYY-MM-DD'),
  '09:30 AM',
  'General Consultation',
  'सर्वसाधारण तपासणी',
  'booked',
  now() - interval '2 hours'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE patient_id = 'MF-P-0002' AND phc_id = 'phc-shivapur'
    AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD')
);

INSERT INTO appointments (phc_id, health_worker_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at)
SELECT
  'phc-shivapur',
  'hw-sunita',
  'PHC Shivapur',
  'प्रा. आ. केंद्र शिवापूर',
  'MF-P-0003',
  'Santosh Jadhav',
  2,
  to_char(CURRENT_DATE, 'YYYY-MM-DD'),
  '11:00 AM',
  'Follow-up Visit',
  'पुन्हा तपासणी',
  'booked',
  now() - interval '1 hour'
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE patient_id = 'MF-P-0003' AND phc_id = 'phc-shivapur'
    AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD')
);

-- Update slot booked counts to match seeded appointments
UPDATE appointment_slots
SET booked = booked + 1
WHERE phc_id = 'phc-shivapur'
  AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD')
  AND time = '09:30 AM'
  AND EXISTS (SELECT 1 FROM appointments WHERE phc_id = 'phc-shivapur' AND time = '09:30 AM' AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD'));

UPDATE appointment_slots
SET booked = booked + 1
WHERE phc_id = 'phc-shivapur'
  AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD')
  AND time = '11:00 AM'
  AND EXISTS (SELECT 1 FROM appointments WHERE phc_id = 'phc-shivapur' AND time = '11:00 AM' AND date = to_char(CURRENT_DATE, 'YYYY-MM-DD'));

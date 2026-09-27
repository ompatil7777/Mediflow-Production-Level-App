-- MediFlow+ Patient and Health Worker Seed & Policy Script

-- 1. Enable RLS access for public (authenticated + anon) during development

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


-- 2. Patients
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES ('MF-P-0001', 'user-patient', 'Ramesh Patil', 'रमेश पाटील', '9876543210', 54, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, ARRAY['Type 2 Diabetes', 'Hypertension'], '2026-08-10T10:00:00Z') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES ('MF-P-0002', 'usr-anita-p', 'Anandi Bai Shinde', 'आनंदी बाई शिंदे', '9876543220', 62, 'F', 'महिला', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, ARRAY['Hypertension'], '2026-08-12T11:00:00Z') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES ('MF-P-0003', 'usr-santosh', 'Santosh Jadhav', 'संतोष जाधव', '9876543221', 48, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, ARRAY['Type 2 Diabetes'], '2026-08-14T09:30:00Z') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES ('MF-P-0004', 'usr-kamal', 'Kamal Bai Gaikwad', 'कमल बाई गायकवाड', '9876543222', 58, 'F', 'महिला', 'vil-3', 'Kanhegaon', 'कान्हेगाव', 'phc-kanhegaon', 'PHC Kanhegaon', 'प्रा. आ. केंद्र कान्हेगाव', '0000 000000', true, ARRAY['Hypertension'], '2026-08-15T14:20:00Z') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;
INSERT INTO patients (id, user_id, full_name, full_name_mr, mobile, age, gender, gender_mr, village_id, village_name, village_name_mr, assigned_phc_id, assigned_phc_name, assigned_phc_name_mr, emergency_contact, consent, chronic_conditions, created_at) VALUES ('MF-P-0005', 'usr-vitthal', 'Vitthal Kadam', 'विठ्ठल कदम', '9876543223', 65, 'M', 'पुरुष', 'vil-2', 'Shivapur', 'शिवापूर', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', '0000 000000', true, ARRAY['Hypertension', 'Joint Pain'], '2026-08-16T10:15:00Z') ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, full_name_mr = EXCLUDED.full_name_mr;

-- 3. Appointment Slots
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5cf4934d-0ee2-464a-a08d-bc201f7f125a', 'phc-shivapur', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('88076e7b-bbfb-4902-b009-2ec11968c577', 'phc-shivapur', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('92ee8f37-be59-43b5-9886-dc5872e2c785', 'phc-shivapur', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('b6971b8d-5418-4689-bd29-8ebdf2f073c7', 'phc-shivapur', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5f9ea457-722b-4b48-a8cc-57e34ce61a2c', 'phc-rampur', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('72b403c1-b13c-46ad-bf26-646a88238f63', 'phc-rampur', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3dda2423-e3cc-487a-a20f-19767a7a3ad1', 'phc-rampur', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('1441cd2a-0939-4922-8a14-5d3eca802642', 'phc-rampur', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('337f004f-1e15-4802-afca-03387eb5d258', 'phc-kanhegaon', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('00ed5ec2-d6c4-4530-9ad9-6db068b4f168', 'phc-kanhegaon', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4f8a20bd-884c-474b-ad06-7cceeae500e7', 'phc-kanhegaon', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('429f968e-9335-468b-995b-43be828d7170', 'phc-kanhegaon', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c00f54df-5400-4bfe-b013-44ff5cbdd3fd', 'phc-wadgaon', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('fa582420-9ae6-4009-af50-37fda45901bd', 'phc-wadgaon', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('54fcdf26-d014-479a-8b65-69a23590e2cc', 'phc-wadgaon', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('2a87a0c1-6931-4a45-b648-0354674b5521', 'phc-wadgaon', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('01d749fc-93c1-4f20-8dd7-9b476a49eebb', 'phc-nimgaon', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('32c7daf0-aa94-4158-ac47-d792c27b4758', 'phc-nimgaon', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('1fa09e27-6cce-47ef-95a6-be4c297f80c9', 'phc-nimgaon', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('8e002c3b-97dc-4d0e-b1d7-759fc8b123d3', 'phc-nimgaon', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('528d1a59-0a49-4383-a624-2977e0829753', 'phc-pathri', '2026-09-27', '09:30 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('368f7ad3-27a7-4c3a-b090-59da563f7b7b', 'phc-pathri', '2026-09-27', '11:00 AM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e866a16b-f457-4e67-ad3c-557fa9063590', 'phc-pathri', '2026-09-27', '02:00 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('0fc7e6e9-0ca8-4ae9-90d9-0f6a0ea35b16', 'phc-pathri', '2026-09-27', '03:30 PM', 10, 3);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('abdee4a7-89f8-4ed4-bafb-397c552e7477', 'phc-shivapur', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4fe4d849-1fd9-4de3-b7da-cc36e512f906', 'phc-shivapur', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d924bbdd-30ac-4ff3-8964-bd28d2ea20ac', 'phc-shivapur', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d570e098-4c27-4f01-9436-7fee2e9d9055', 'phc-shivapur', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('93ecdf59-0c77-4f45-ac20-4dada2a65236', 'phc-rampur', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('1d11ef73-9eb6-47e1-8497-282970abf4db', 'phc-rampur', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('0fb20e7b-7e28-43de-951d-5b9a308ba716', 'phc-rampur', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('bc632976-1a08-4e66-9d15-3e3b8e8e9498', 'phc-rampur', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('af7069b7-5528-4bcd-adca-f46c8a6dfbf2', 'phc-kanhegaon', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('bd44b999-c32d-49be-a478-585f18c54964', 'phc-kanhegaon', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5d15e87c-f12e-4e09-ba02-a963a2b96747', 'phc-kanhegaon', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7cc37a96-e5b4-4ff1-b890-8cdaa00d46f2', 'phc-kanhegaon', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4e998917-290a-4578-bc1f-5d49a34d648c', 'phc-wadgaon', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('8e99cdc3-ccbb-4c4a-9a16-2afbd158e424', 'phc-wadgaon', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c6be5b2f-c9f4-403e-8a54-00c45e860b83', 'phc-wadgaon', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('0c740a5d-6b00-4378-979e-db139f73a285', 'phc-wadgaon', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e0542cd2-df1c-4cd5-ab59-832f8e1a2300', 'phc-nimgaon', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5c032eac-c2cb-44fe-9e93-90fea534dbf3', 'phc-nimgaon', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('a001d827-f7e3-4779-b705-f74d3dfc5fac', 'phc-nimgaon', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('767d969a-2514-4661-88f9-bd2b0564709c', 'phc-nimgaon', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('719f7529-8034-46c5-88df-a31687d9ec59', 'phc-pathri', '2026-09-28', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('136e4e19-f715-4832-8db3-0286fc6fa8e4', 'phc-pathri', '2026-09-28', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3f16e5df-1028-4fdc-b8c4-7f84d68427ef', 'phc-pathri', '2026-09-28', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('9575bb59-1b33-4397-9311-768d041f0079', 'phc-pathri', '2026-09-28', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('23873e59-a792-4d56-ab7d-1d417c00528a', 'phc-shivapur', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('928bfb1d-30ef-493c-bf18-de975397fe2e', 'phc-shivapur', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7dd92071-cfd6-4568-9ae9-9ac639da7ced', 'phc-shivapur', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('b7175d70-c267-4be4-bc5d-d3d13742ae16', 'phc-shivapur', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('97e6d9fa-2707-4da2-8ba4-626328ba4793', 'phc-rampur', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('19561564-5b2b-46d4-9899-d7a946a111d3', 'phc-rampur', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3e0ea0f8-f535-4165-8d3f-3b44f727f134', 'phc-rampur', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5aff49ff-a484-4fbf-a62f-3579c7e9ddb8', 'phc-rampur', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('b1fdd0d8-2621-4453-a787-e3bd1feaabf7', 'phc-kanhegaon', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3344d94b-9221-4138-8148-88ef52ce8956', 'phc-kanhegaon', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d86974df-4abc-4bc8-a6d1-836dc4a0cd72', 'phc-kanhegaon', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e6b96418-a2ef-4642-8dea-a6058f16fe39', 'phc-kanhegaon', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('bae720c8-664a-4919-807b-72dbc74817e5', 'phc-wadgaon', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('9769d108-fcca-420c-8c79-62c35840ad21', 'phc-wadgaon', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('ef040ef6-f632-410f-8df8-c3840613a255', 'phc-wadgaon', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c2166d61-d336-4085-b849-304108a60235', 'phc-wadgaon', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('77ab5a31-4e3b-4054-b40f-19d8a49ef1b9', 'phc-nimgaon', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('bc51ccf0-c021-44d2-9253-f35e2c609c92', 'phc-nimgaon', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e4884b1d-5c2c-428b-bb22-2e180d736888', 'phc-nimgaon', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('106699b9-2f45-4e31-a54f-cdbd50617c38', 'phc-nimgaon', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('a602f96a-a155-42b3-b56c-560c082e8b1f', 'phc-pathri', '2026-09-29', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('35d68b55-c93b-47dd-a812-0863bedcbd5e', 'phc-pathri', '2026-09-29', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('9efa1bf4-314c-4036-96cb-82a6f3e896dc', 'phc-pathri', '2026-09-29', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('221dab8f-5df3-455d-9f03-a7513a5b7c68', 'phc-pathri', '2026-09-29', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('a9f9c3dd-cfff-4666-adc0-b184e2af6dc5', 'phc-shivapur', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('441c616b-5882-4ddb-ad63-8d4874395bf4', 'phc-shivapur', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('efb03867-ae02-499a-97be-d1268b6a16a8', 'phc-shivapur', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3f29f15b-7d39-4d05-8885-d60a218336a2', 'phc-shivapur', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('adeed635-8eaf-41a9-b078-9f4236b070ca', 'phc-rampur', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c3f8422c-4fa5-429c-a4e1-ae572ab10714', 'phc-rampur', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('95c3bf44-f6b5-404e-9843-98e246e90f3f', 'phc-rampur', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c712d1a4-6678-464d-9e94-c6f0f9865254', 'phc-rampur', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('feb76d21-6a2d-46de-8fdb-2e4a35fbede3', 'phc-kanhegaon', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('1c7d252a-64b2-4feb-aee0-54614729f920', 'phc-kanhegaon', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c189d656-6f3d-4720-b980-babd5a6521f6', 'phc-kanhegaon', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('8465e4b2-63ad-4e59-8b2b-383cccd8f9e5', 'phc-kanhegaon', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('76516dc3-a8c6-4a4a-a21c-4c466fe45333', 'phc-wadgaon', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e4f1c57f-cd72-4f0b-8864-43b5e094f98f', 'phc-wadgaon', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('0c6707fe-ab47-4044-ac38-20ab9fa267ec', 'phc-wadgaon', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('24de0e15-f8fa-4b58-8185-83b7ed687da1', 'phc-wadgaon', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7cf23fc6-3b83-446c-a120-d4a9a746effa', 'phc-nimgaon', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4f44255a-2b6a-4a43-8a52-ad9769df4067', 'phc-nimgaon', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d98fc254-7dc6-4817-b2c9-d91696068596', 'phc-nimgaon', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('da4e38e5-105a-48f6-8293-76d448201696', 'phc-nimgaon', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e4000b64-eb6a-47a1-b359-6806fa48a9b6', 'phc-pathri', '2026-09-30', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4d92ddb9-b0d2-45ff-95d8-52499db7927e', 'phc-pathri', '2026-09-30', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('8bad96da-69eb-4c8b-9dce-783bb4de7daf', 'phc-pathri', '2026-09-30', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e2c4f4dd-5ebe-45d2-be0e-826bbfa01914', 'phc-pathri', '2026-09-30', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c55b68fd-b14e-4fe9-a5d9-32559dc17af0', 'phc-shivapur', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('30e835eb-875a-42f8-b854-4eee7d8c4ad7', 'phc-shivapur', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('835dc94b-a12d-46c6-b962-ceb6285b711d', 'phc-shivapur', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('95b4e8da-7689-4f79-8cd2-5a157253e403', 'phc-shivapur', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('a2817abc-d121-4af9-8e44-b0d6de61e8c0', 'phc-rampur', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d2881e1f-3c09-4d39-b893-e3bf0a306097', 'phc-rampur', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5f58bc1d-d33c-47be-b3b1-d750615522d4', 'phc-rampur', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('0edd1232-8db0-4a71-97cd-b7f798906cf5', 'phc-rampur', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c1a11bdf-20e7-43f0-b9d5-d5b43b920af1', 'phc-kanhegaon', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d854a46a-3c9e-4e3a-accd-8eb0ec30ed8d', 'phc-kanhegaon', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('a0110c37-cdc9-40e2-a592-2bea0ab60d22', 'phc-kanhegaon', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3b473d1f-b37e-42da-82c0-f1f268a7458d', 'phc-kanhegaon', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('dadc8644-f599-4237-a17d-5a4101014fbc', 'phc-wadgaon', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3abfbe6d-1e51-46d4-9ce4-46b8a4cb2caa', 'phc-wadgaon', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('fdab9fc5-a1aa-4bb2-bfc4-1ce0a7b15490', 'phc-wadgaon', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('6dd9b0fe-2e64-4624-a0f2-46c948a76ef2', 'phc-wadgaon', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('9d00bbb6-4bec-4117-887a-29c90d3b6a12', 'phc-nimgaon', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('bb7c3218-d82a-45f4-87c0-aaaff2d781b2', 'phc-nimgaon', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('f3d26d6e-5f39-46ff-aeb1-dba775060f90', 'phc-nimgaon', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('6e487515-0472-47bb-b079-bc19edd6d486', 'phc-nimgaon', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('28261313-149f-42c5-a1c1-41092e2043a9', 'phc-pathri', '2026-10-01', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('ffdca809-9902-4606-a1ed-e41914561553', 'phc-pathri', '2026-10-01', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('60f31e7c-5792-4ff4-a28d-0a4d23b46582', 'phc-pathri', '2026-10-01', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5f536011-8fed-4fb1-b563-8eb19845f9f5', 'phc-pathri', '2026-10-01', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('421c269a-319e-4e07-b579-caaf7367f0e3', 'phc-shivapur', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('f8a82a3f-5bdc-46ca-8693-26f4f0ee8ddc', 'phc-shivapur', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('18fd5d7b-4789-4f28-96bc-832fb410f416', 'phc-shivapur', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('f00723a6-1789-4e4f-b315-a970be90806f', 'phc-shivapur', '2026-10-02', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7fa4eb2e-61fa-4a36-be65-1689258f97f6', 'phc-rampur', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('3587fb79-d890-4cee-9d31-a8642d8e1e31', 'phc-rampur', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('5435a0ba-e349-48f2-90e8-1d614086ad6d', 'phc-rampur', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('e4cfe931-8424-4c66-a7dd-7c46957fa961', 'phc-rampur', '2026-10-02', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('c05b6e04-e3d3-4a3f-ad34-5a21a6094d50', 'phc-kanhegaon', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('03a3e3f0-92ac-4490-8d79-5058aefbd261', 'phc-kanhegaon', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('890e287f-b0ba-41cc-a854-54173617b36c', 'phc-kanhegaon', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('886265bc-b754-40d4-85bf-0d7b0a046ef1', 'phc-kanhegaon', '2026-10-02', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('12606803-da54-4723-9da3-2a98f5f9eff5', 'phc-wadgaon', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('6c031b77-e3bc-4e36-aacc-2d70bbe38829', 'phc-wadgaon', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('d9e9d669-2ba7-4d7d-934f-996bd948e355', 'phc-wadgaon', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('97867ffb-d8f4-41ac-afee-4c73fa0b984c', 'phc-wadgaon', '2026-10-02', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('ba7da19b-8ccb-4394-88f8-7b429e40eeba', 'phc-nimgaon', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('302b3307-3167-4220-8e90-1683167303bf', 'phc-nimgaon', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('11d1528e-3291-424a-94ff-7c216ea576a0', 'phc-nimgaon', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7e3b61e2-a6a0-43fc-aee6-318a8d7574c5', 'phc-nimgaon', '2026-10-02', '03:30 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('dd5b84d6-e3e9-4453-a716-a41b51e7ef82', 'phc-pathri', '2026-10-02', '09:30 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('7dd0e57b-4f28-4f5b-91f5-35fbce469941', 'phc-pathri', '2026-10-02', '11:00 AM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('4d982868-c9f6-44d2-b2ea-6d92af2e69c0', 'phc-pathri', '2026-10-02', '02:00 PM', 10, 1);
INSERT INTO appointment_slots (id, phc_id, date, time, capacity, booked) VALUES ('17075a66-1a65-4dfb-801c-39d6543f5fbb', 'phc-pathri', '2026-10-02', '03:30 PM', 10, 1);

-- 4. Initial Health Readings
INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) VALUES ('4382bb97-2799-453c-95ee-cd2e74ac4f6b', 'MF-P-0001', 'bp', 128, 82, NULL, NULL, 'Within recorded target range', 'नोंदवलेल्या मर्यादेत', 'Sunita Gaikwad (ANM)', 'health_worker', '2026-09-18T10:30:00Z');
INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) VALUES ('ccc3329a-a2a5-407a-a98a-5c6acecaf2de', 'MF-P-0001', 'sugar', NULL, NULL, 136, 'fasting', 'Within recorded target range', 'नोंदवलेल्या मर्यादेत', 'Sunita Gaikwad (ANM)', 'health_worker', '2026-09-18T10:35:00Z');
INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) VALUES ('3da4bcb3-d8c0-4a30-a3bf-b67eff12eb0d', 'MF-P-0001', 'bp', 142, 88, NULL, NULL, 'Needs attention', 'लक्ष देणे आवश्यक', 'Ramesh Patil (Self)', 'patient', '2026-09-10T08:15:00Z');
INSERT INTO health_readings (id, patient_id, type, systolic, diastolic, glucose, reading_type, status_label, status_label_mr, recorded_by, recorded_role, recorded_at) VALUES ('915b08aa-10a6-41ec-b531-8b1debd37726', 'MF-P-0001', 'sugar', NULL, NULL, 172, 'post_meal', 'Needs attention', 'लक्ष देणे आवश्यक', 'Ramesh Patil (Self)', 'patient', '2026-09-10T14:30:00Z');

-- 5. Initial Appointments
INSERT INTO appointments (id, phc_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at) VALUES ('ddc50e0e-9b91-40ab-9102-7a662387c8ce', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', 'MF-P-0001', 'Ramesh Patil', 4, '2026-09-27', '09:30 AM', 'Chronic Disease Follow-up', 'दीर्घकालीन आजार पाठपुरावा', 'booked', '2026-09-27T10:21:04.636Z');
INSERT INTO appointments (id, phc_id, phc_name, phc_name_mr, patient_id, patient_name, token_no, date, time, care_type, care_type_mr, status, created_at) VALUES ('33515138-d30a-4d79-b653-46236395b2f7', 'phc-shivapur', 'PHC Shivapur', 'प्रा. आ. केंद्र शिवापूर', 'MF-P-0002', 'Anandi Bai Shinde', 5, '2026-09-27', '11:00 AM', 'Blood Pressure Check', 'रक्तदाब तपासणी', 'checked_in', '2026-09-27T10:21:04.636Z');
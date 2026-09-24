# MediFlow+ — Build Specification (single source of truth)

> Tagline: "One Connected Loop for Patient Care & Medicine Supply"
> Rural public-health DEMO prototype (MCA / Health Informatics). All data is fictional.

## 0. How to use this file
- The visual source of truth is the Stitch project **"MediFlow+ Rural Health App"** (ID `16341560252394000441`, 69 screens). Read it through the Stitch MCP.
- This file is the source of truth for data, roles, logic, and tests. If Stitch text conflicts with this file, THIS FILE WINS (Stitch may contain leftover wording).
- Never add features, screens, claims, or medicines that are not in this file or the Stitch design.

## 1. Hard rules
- **Free tier only.** Supabase Free plan (PostgreSQL + Auth + Realtime). No paid services, no Edge Functions, no Storage, no PITR, no paid SMS/email.
- **Stack:** React + Vite + TypeScript + Tailwind + React Router + `@supabase/supabase-js` + Recharts + `vite-plugin-pwa`. Mobile-first PWA (390px design width), installable on Android. Local cache (IndexedDB) for last-known read data.
- **Language:** English + Marathi through dictionary files (`src/i18n/en.json`, `src/i18n/mr.json`). No hard-coded UI strings. Fonts: Plus Jakarta Sans (English) + Noto Sans Devanagari (Marathi).
- **Content rules (rural, fictional):**
  - Places: Demo District, Rampur Taluka. Villages: Rampur, Shivapur, Kanhegaon, Wadgaon, Nimgaon, Pathri. PHCs: PHC Rampur, PHC Shivapur, PHC Kanhegaon, PHC Wadgaon, PHC Nimgaon, PHC Pathri. Network name: "Rural Health Demo Network".
  - NEVER show: Pune, Maharashtra government, Zilla Parishad, National Health Mission, ABHA, DPDP, "verified", "approved by", "official", encryption or compliance claims.
  - NO OTP, NO SMS toggles anywhere.
  - Only these 10 medicines: Paracetamol 500mg, Metformin 500mg, Amlodipine 5mg, Losartan 50mg, ORS, Glimepiride 1mg, Atorvastatin 10mg, Insulin, Iron tablets, Calcium tablets.
  - Stock states: Available, Low stock, Out of stock, Restocking. Never rely on colour alone (icon + label).
  - Fictional phone numbers "0000 000000". Ambulance 108 shown as information only.
  - Footer on data screens: "Demo environment. All data is fictional."
- **Safety text:** "Care-navigation guidance only. Not a medical device." Urgent: "Seek immediate medical attention. Emergency services are outside MediFlow+'s scope." No diagnosis, no prescriptions, no "AI doctor".
- **Security:** only the anon key ships in the app. The `service_role` key is NEVER in the client or repo (use `.env` outside git; only the local seed script uses it).

## 2. Core idea
One shared live PostgreSQL database, five role-based views in ONE app. Every action creates useful information for the next stakeholder:

Patient data -> PHC care -> pharmacy usage -> PHC inventory -> village-wise demand -> reorder request -> District Health Office approval -> Supply Depot dispatch -> PHC stock update -> villager sees medicine available.

## 3. Roles and permissions (enforced in the DATABASE with RLS + RPC, not only in the UI)
Roles (enum): `patient | health_worker | pharmacist | authority | supply`.
UI labels: Patient/Villager; Health Worker (ANM / CHO / ASHA); PHC Pharmacist; District Health Office; Supply Depot.

Store role in `public.profiles(id references auth.users, role, full_name, phc_id, district_id)`. Never read the role from user-editable metadata. Users must not be able to change their own role, phc_id, or district_id (policy + column privileges + pgTAP test). Use SECURITY DEFINER helper functions in a private schema (`auth_role()`, `auth_phc_id()`, `auth_district_id()`) with a fixed `search_path`.

- **Patient:** read/update own profile; insert/read own health_readings and triage_records; read own appointments; READ-ONLY on `stock_public` and PHC status. Cannot see other patients or write inventory.
- **Health Worker:** read patients assigned to own PHC; record BP/sugar readings; manage own PHC appointments; set own PHC live status (consulting | paused | closed). Cannot approve supply.
- **Pharmacist:** read/write inventory for own PHC only (through RPC); create reorder requests; mark shipments received.
- **District Health Office (authority):** read all PHCs, inventory, requests, shipments in own district plus aggregates; approve/reject (rejection requires a reason); read audit trail and root cause.
- **Supply Depot:** read approved requests; dispatch; update shipment status; read warehouse stock.
- **audit_logs:** append-only, written only by triggers/RPC. UPDATE and DELETE revoked for everyone.
- Revoke direct INSERT/UPDATE/DELETE on `inventory`, `live_slots`, `reorder_requests`, `approvals`, `shipments`, `shipment_status_history` from client roles. All writes go through the RPC functions below.

## 4. Authentication (free, rural-friendly)
- Supabase email/password auth.
- **Patients** sign in with **mobile number + password**. The app maps the number to an internal email such as `9876543210@mediflow.demo`. No SMS/OTP (paid). Document that a real deployment would need OTP verification.
- **Staff** sign in with staff email or ID + password. Staff accounts are pre-created by the seed script or an authority-only admin function. There is NO staff self sign-up.
- Email confirmation is OFF for the demo project (free built-in email is heavily rate-limited).
- A database trigger forces new self-registered users to role `patient`.
- Patient sign-up collects: name, mobile, password, village, age, gender, emergency contact, consent flag; auto-assigns the PHC serving the village; issues a Patient ID like `MF-P-0021`.
- "Try Demo" signs in to seeded demo accounts, one per role, plus an in-app role switcher and a "Demo Environment" badge.
- Password reset: "Contact your PHC or District Health Office" (no email reset in the prototype).

## 5. Database schema (PostgreSQL; enums, FKs, indexes, CHECK constraints)
`districts`, `talukas`, `villages`, `profiles`, `phcs` (status: consulting|paused|closed, lat, lng, district_id, taluka_id, opening_hours, updated_at), `phc_villages` (which villages each PHC serves), `patients` (profile link, age, gender, village_id, assigned_phc_id, emergency_contact, consent), `medicines`, `inventory` (unique phc_id+medicine_id: current_stock, min_threshold, reorder_point, safety_stock, avg_daily_usage, lead_time_days, target_stock, status: available|low|out|restocking, updated_at), `stock_public` (denormalised read-only mirror: phc_id, medicine_id, quantity, status, updated_at; maintained by trigger; what patients read; realtime-subscribable), `stock_movements` (type: dispense|receive|adjustment, qty, prev, new, actor_id, created_at), `warehouse_stock` (district_id, medicine_id, quantity), `live_slots` (unique phc_id+slot_date+slot_time: capacity, booked, CHECK booked <= capacity), `appointments` (unique patient+slot; status: booked|checked_in|consultation|completed|cancelled; token_no), `triage_records`, `health_readings` (type: bp|sugar; systolic, diastolic, glucose; reading_type: fasting|post_meal|random; recorded_by; recorded_at), `reorder_requests` (status: pending|approved|rejected|dispatched|received; priority: normal|high|critical; CHECK rejection_reason NOT NULL when rejected), `approvals`, `shipments` (status: approved|dispatched|in_transit|arrived|received|inventory_updated), `shipment_status_history` (status, actor_id, actor_role, at), `notifications` (user_id, title, message, type, read, created_at), `activity_logs` (category, phc_id, district_id, message, created_at), `audit_logs` (actor_id, actor_role, action, entity, entity_id, previous_value jsonb, new_value jsonb, created_at).

Add to the `supabase_realtime` publication: phcs, stock_public, inventory, live_slots, appointments, reorder_requests, shipments, notifications, activity_logs. RLS applies to realtime, so test it. Index every foreign key and the alert query (inventory where status in ('low','out')).

## 6. RPC functions (SECURITY DEFINER, role-checked inside, atomic; each writes audit_logs + activity_logs and creates notifications)
- `book_appointment(phc, date, time, care_type)`: `SELECT ... FOR UPDATE` on the slot; fail if PHC status is not consulting or booked >= capacity; insert appointment (token_no); increment booked; notify health workers. Two simultaneous bookings for the last slot: exactly one succeeds.
- `set_phc_status(status)`: health worker of that PHC only.
- `record_reading(...)`: health worker (assigned patients) or patient (own).
- `update_stock(inventory_id, new_stock, reason)`: pharmacist of that PHC; writes stock_movement; recomputes status and the stock_public mirror; audit previous -> new; flags possible data-entry issue if change > 30% of stock.
- `create_reorder_request(phc, medicine, qty, priority, reason)`: pharmacist; notifies district authority users.
- `decide_request(request_id, approve|reject, reason)`: authority of that district only; approve creates shipment (status approved + history row) and notifies pharmacist and supply staff; reject requires a reason.
- `dispatch_shipment(shipment_id)`: supply staff; decrement warehouse_stock (fail with "warehouse shortage" if insufficient); status dispatched; history row.
- `update_shipment_status(shipment_id, in_transit|arrived)`: supply staff; history row.
- `receive_shipment(shipment_id)`: pharmacist of destination PHC; set received, ADD quantity to inventory, set inventory_updated, set request received, refresh stock_public, notify authority, audit.

## 7. Rule-based engines (NO AI, NO ML; SQL views/functions so they are explainable)
1. **Triage:** structured decision tree (symptoms -> severity -> duration -> follow-ups) mapped to ROUTINE / CONSULTATION / URGENT via a transparent rules table in a config file. Red-flag rules (breathing difficulty; chest discomfort + severe) force URGENT.
2. **Reorder:** `avg_daily_usage` = 14-day moving average of dispense movements. `ReorderPoint = AvgDailyUsage x LeadTimeDays + SafetyStock`. If `current_stock < ReorderPoint` show "Reorder recommended". `SuggestedQty = TargetStock - CurrentStock`. `DaysRemaining = current_stock / avg_daily_usage`. Show formula and inputs, labelled "Rule-based recommendation".
3. **Demand estimate** (by village/taluka/district/medicine/period): `moving-average daily usage x 30` plus a growth factor from recent chronic-patient count. Show Estimated demand, Current supply, Gap, Trend. Label "Statistical estimation, not AI".
4. **Chronic status:** threshold rules on BP/sugar -> "Within recorded target range" / "Needs attention" / "Follow-up recommended". No diagnosis wording.
5. **Root-cause classifier** (SQL view over requests, shipments, history, audit, movements):
   - Approval Delay: request pending > 24h
   - Supply Delay: dispatched/in transit longer than expected lead time
   - Unexpected Demand Increase: 7-day usage > 1.25 x 30-day usage
   - Warehouse Shortage: warehouse stock < requested quantity
   - Data Entry Issue: manual adjustment > 30% of stock, or a negative adjustment later reversed
   Render as an auditable timeline: actor, role, timestamp, previous -> new state.

## 8. Seed data (supabase/seed.sql + local seed script; clearly fictional)
1 district "Demo District" (+2 placeholder districts), "Rampur Taluka" (+2 placeholders), 6 villages, 6 PHCs (each serving 2-4 villages), 10 medicines, 20 patients with Indian-style names across villages, demo accounts for every role (Patient Ramesh Patil `MF-P-0001` in Shivapur; Health Worker Sunita Gaikwad; Pharmacist Ganesh Jadhav; District Health Officer Dr. Meena Kulkarni; Supply Depot Rajesh Pawar; Doctor Dr. Anita Deshmukh at PHC Shivapur), district warehouse stock, 30 days of stock_movements and readings so charts and moving averages work.

**Demo scenario start state:** Metformin 500mg at PHC Shivapur: stock 84, avg_daily_usage 12, lead_time 7 days, safety_stock 30 -> reorder_point 114, target_stock 284, status LOW. Losartan 50mg at PHC Shivapur: Restocking (used for the root-cause example).

## 9. Screen map (Stitch screen name -> role/route). 68 screens + 1 logo asset
- **Auth / entry (15):** Splash & Language, Onboarding 1, Onboarding 2, Onboarding 3, Welcome, Patient Sign In, Patient Sign In States, Register Step 1, Register Step 2, Register Consent, Register Success, Staff Sign In, Demo Role Picker, Settings, Sign Out Confirmation
- **Patient (13):** Patient Home, Symptom Check, Triage Result, Medicine Stock, Medicine Details, Nearby PHCs, PHC Details, Book Appointment, Appointment Confirmed, My Health, Add Reading, Notifications, How MediFlow+ Connects
- **Health Worker (8):** HW Dashboard, HW PHC Status Change, HW Appointments Queue, HW Patients, HW Patient Record, HW Record Health Reading, HW Village Visits, HW Pending Sync
- **Pharmacist (8):** Pharmacist Inventory, Update Stock, Reorder Recommendation, Replenishment Request, Request Status, Receive Stock, Pharmacist Demand, Pharmacist History
- **District Health Office (9):** District Overview, Taluka Map, PHC Detail, Pending Approvals, Approval Details, Reject Reason, District Demand, Root Cause, Audit Trail
- **Supply Depot (7):** Supply Dashboard, Supply Orders, Order Details, Create Dispatch, Shipment Tracker, Delivery Confirmation, Warehouse Stock
- **Shared (8):** Live Activity, Staff Notifications, State: Loading, State: Empty, State: Error, State: Offline, State: Back Online, Roles and Access
- **Asset (not a screen):** MediFlow+ Logo
- Note: "PHC Details" (patient view) and "PHC Detail" (District Health Office view) are two different screens.
- Bottom navigation per role: Patient (Home, Care, Health, Appointments, Profile); Health Worker (Dashboard, Patients, Appointments, Records, Profile); Pharmacist (Inventory, Requests, Demand, History, Profile); District (Overview, PHCs, Approvals, Demand, Audit); Supply (Orders, Dispatch, Deliveries, Warehouse, Profile).

## 10. Live-sync UX
Use Supabase Realtime so the UI updates with no refresh. Show a Live badge and "Updated just now / 10s ago". On connection loss: "You are offline. Showing saved data. Some information may be outdated." (cached data, read-only); on reconnect: "Back online. Syncing..." then "Synced". Briefly highlight changed values. Never show "pull to refresh". Writes need a connection; say so honestly in the UI. Show "Last synced" on data screens; amber "Data may be outdated" bar if older than 30 minutes.

## 11. Free-tier budget (verify current limits at supabase.com/pricing)
About 500 MB database, 5 GB egress/month, limited realtime connections. Keep seed data small; subscribe only to scoped tables with filters; unsubscribe on unmount; never poll; fetch aggregates with SQL views/RPC. Free projects pause after ~7 days of inactivity: add a GitHub Actions cron (every 3 days) that sends a lightweight REST request with the anon key, and document "restore the project the day before the viva".

## 12. Acceptance tests (two-device live demo; no refresh)
1. Patient device shows Metformin @ PHC Shivapur = LOW STOCK (84).
2. Pharmacist creates a 200-unit request -> District Office sees "Pending approval" instantly.
3. District approves -> Supply Depot sees a new approved order; Pharmacist sees "Approved".
4. Supply dispatches -> "In Transit" visible to Pharmacist and District; warehouse stock decreases by 200.
5. Pharmacist marks Received -> stock 84 -> 284, status AVAILABLE; Patient updates live; District shows delivery completed; audit_logs contain every step.
6. Health Worker sets PHC to Paused -> Patient's Nearby PHCs flips to Paused and booking is disabled.
7. Two patients book the last slot simultaneously: exactly one succeeds.
8. Security (pgTAP): a patient calling the REST API directly cannot update inventory, read another patient's records, or change own role; a pharmacist cannot touch another PHC's stock; a health worker cannot approve; audit_logs reject UPDATE/DELETE. At least one allow and one deny test per role.

## 13. Build phases
- **Stage A (UI only, mock data, no backend):** DESIGN.md from Stitch, folder structure and route map, theme and shared components, all screens role by role with fictional mock data (including the Metformin scenario), demo role switcher, i18n. STOP for approval.
- **Stage B (after approval):**
  - Phase 1: Supabase local stack, migrations, helper functions, RLS, seed, pgTAP tests, Auth + role routing.
  - Phase 2: closed-loop vertical slice (inventory -> reorder -> approval -> shipment -> receive -> patient availability) with realtime, activity, audit. Run tests 1-5 and 8.
  - Phase 3: patient care features (triage, PHCs, appointments, readings, charts). Tests 6-7.
  - Phase 4: health worker module and PHC live status.
  - Phase 5: demand analytics, root-cause engine, district map.
  - Phase 6: offline/error/empty states, keep-alive workflow, polish, final tests.
- After each phase run the relevant tests and summarise what works.

## 14. Deliverables
Full source code, `supabase/migrations`, `seed.sql`, pgTAP tests, `.env.example` (URL + anon key only), GitHub Actions keep-alive workflow, README (create the free Supabase project, apply migrations, run locally, build the PWA, two-device demo script), and a short list of known limitations (free-tier pause/limits, no real push notifications, read-only offline mode, prototype-level security not reviewed for real patient data).

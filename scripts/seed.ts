import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { MOCK_PHCS, MOCK_MEDICINES, INITIAL_WAREHOUSE_STOCK } from '../src/data/mockData';

// Load .env
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env');
  } catch (e) {
    console.warn('Could not auto-load .env file:', e);
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing VITE_SUPABASE_URL or API key in .env');
  process.exit(1);
}

const isServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using ${isServiceRole ? 'SUPABASE_SERVICE_ROLE_KEY (RLS bypass)' : 'ANON/PUBLISHABLE KEY'}`);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

// Prepare data matching exact DB column schemas
const phcsData = MOCK_PHCS.map((p) => ({
  id: p.id,
  name: p.name,
  name_mr: p.nameMr,
  status: p.status,
  status_reason: p.statusReason || null,
  status_reason_mr: p.statusReasonMr || null,
  doctor_name: p.doctorName,
  doctor_name_mr: p.doctorNameMr,
  hw_name: p.hwName,
  pharmacist_name: p.pharmacistName,
  phone: p.phone,
  lat: p.lat,
  lng: p.lng,
  taluka: p.taluka,
  district: p.district,
  opening_hours: p.openingHours,
  opening_hours_mr: p.openingHoursMr,
  assigned_villages: p.assignedVillages,
  updated_at: p.updatedAt,
}));

const medicinesData = MOCK_MEDICINES.map((m) => ({
  id: m.id,
  name: m.name,
  name_mr: m.nameMr,
  dosage: m.dosage,
  category: m.category,
  category_mr: m.categoryMr,
}));

const warehouseStockData = INITIAL_WAREHOUSE_STOCK.map((w) => ({
  medicine_id: w.medicineId,
  medicine_name: w.medicineName,
  medicine_name_mr: w.medicineNameMr,
  quantity: w.quantity,
  min_buffer: w.minBuffer,
}));

// Also generate SQL file for SQL editor execution if needed
function generateSqlSeed() {
  const sqlLines: string[] = ['-- MediFlow+ Reference Data Seed Script'];

  // Medicines
  sqlLines.push('\n-- 1. Medicines');
  for (const m of medicinesData) {
    const esc = (s: string) => s.replace(/'/g, "''");
    sqlLines.push(
      `INSERT INTO medicines (id, name, name_mr, dosage, category, category_mr) ` +
        `VALUES ('${esc(m.id)}', '${esc(m.name)}', '${esc(m.name_mr)}', '${esc(m.dosage)}', '${esc(m.category)}', '${esc(m.category_mr)}') ` +
        `ON CONFLICT (id) DO UPDATE SET ` +
        `name = EXCLUDED.name, name_mr = EXCLUDED.name_mr, dosage = EXCLUDED.dosage, ` +
        `category = EXCLUDED.category, category_mr = EXCLUDED.category_mr;`
    );
  }

  // PHCs
  sqlLines.push('\n-- 2. PHCs');
  for (const p of phcsData) {
    const esc = (s: string | null) => (s ? `'${s.replace(/'/g, "''")}'` : 'NULL');
    const villages = `ARRAY[${p.assigned_villages.map((v) => `'${v.replace(/'/g, "''")}'`).join(', ')}]`;
    sqlLines.push(
      `INSERT INTO phcs (id, name, name_mr, status, status_reason, status_reason_mr, doctor_name, doctor_name_mr, hw_name, pharmacist_name, phone, lat, lng, taluka, district, opening_hours, opening_hours_mr, assigned_villages, updated_at) ` +
        `VALUES (${esc(p.id)}, ${esc(p.name)}, ${esc(p.name_mr)}, ${esc(p.status)}, ${esc(p.status_reason)}, ${esc(p.status_reason_mr)}, ${esc(p.doctor_name)}, ${esc(p.doctor_name_mr)}, ${esc(p.hw_name)}, ${esc(p.pharmacist_name)}, ${esc(p.phone)}, ${p.lat}, ${p.lng}, ${esc(p.taluka)}, ${esc(p.district)}, ${esc(p.opening_hours)}, ${esc(p.opening_hours_mr)}, ${villages}, ${esc(p.updated_at)}) ` +
        `ON CONFLICT (id) DO UPDATE SET ` +
        `name = EXCLUDED.name, name_mr = EXCLUDED.name_mr, status = EXCLUDED.status, ` +
        `status_reason = EXCLUDED.status_reason, status_reason_mr = EXCLUDED.status_reason_mr, ` +
        `doctor_name = EXCLUDED.doctor_name, doctor_name_mr = EXCLUDED.doctor_name_mr, ` +
        `hw_name = EXCLUDED.hw_name, pharmacist_name = EXCLUDED.pharmacist_name, ` +
        `phone = EXCLUDED.phone, lat = EXCLUDED.lat, lng = EXCLUDED.lng, ` +
        `taluka = EXCLUDED.taluka, district = EXCLUDED.district, ` +
        `opening_hours = EXCLUDED.opening_hours, opening_hours_mr = EXCLUDED.opening_hours_mr, ` +
        `assigned_villages = EXCLUDED.assigned_villages, updated_at = EXCLUDED.updated_at;`
    );
  }

  // Warehouse Stock
  sqlLines.push('\n-- 3. Warehouse Stock');
  for (const w of warehouseStockData) {
    const esc = (s: string) => s.replace(/'/g, "''");
    sqlLines.push(
      `INSERT INTO warehouse_stock (medicine_id, medicine_name, medicine_name_mr, quantity, min_buffer) ` +
        `VALUES ('${esc(w.medicine_id)}', '${esc(w.medicine_name)}', '${esc(w.medicine_name_mr)}', ${w.quantity}, ${w.min_buffer}) ` +
        `ON CONFLICT (medicine_id) DO UPDATE SET ` +
        `medicine_name = EXCLUDED.medicine_name, medicine_name_mr = EXCLUDED.medicine_name_mr, ` +
        `quantity = EXCLUDED.quantity, min_buffer = EXCLUDED.min_buffer;`
    );
  }

  const outDir = path.resolve('supabase');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outFile = path.join(outDir, 'seed_reference.sql');
  fs.writeFileSync(outFile, sqlLines.join('\n'), 'utf-8');
  console.log(`Generated SQL seed script at: ${outFile}`);
}

async function runSeed() {
  generateSqlSeed();

  console.log('\n--- Seeding medicines ---');
  const { data: medData, error: medError } = await supabase
    .from('medicines')
    .upsert(medicinesData, { onConflict: 'id' })
    .select();
  if (medError) {
    console.error('Error inserting medicines:', medError);
  } else {
    console.log(`Successfully seeded ${medData?.length || medicinesData.length} medicines.`);
  }

  console.log('\n--- Seeding phcs ---');
  const { data: phcData, error: phcError } = await supabase
    .from('phcs')
    .upsert(phcsData, { onConflict: 'id' })
    .select();
  if (phcError) {
    console.error('Error inserting phcs:', phcError);
  } else {
    console.log(`Successfully seeded ${phcData?.length || phcsData.length} phcs.`);
  }

  console.log('\n--- Seeding warehouse_stock ---');
  const { data: whData, error: whError } = await supabase
    .from('warehouse_stock')
    .upsert(warehouseStockData, { onConflict: 'medicine_id' })
    .select();
  if (whError) {
    console.error('Error inserting warehouse_stock:', whError);
  } else {
    console.log(`Successfully seeded ${whData?.length || warehouseStockData.length} warehouse stock items.`);
  }

  console.log('\n--- Querying row counts ---');
  const { count: medCount, error: mcErr } = await supabase
    .from('medicines')
    .select('*', { count: 'exact', head: true });
  const { count: phcCount, error: pcErr } = await supabase
    .from('phcs')
    .select('*', { count: 'exact', head: true });
  const { count: whCount, error: wcErr } = await supabase
    .from('warehouse_stock')
    .select('*', { count: 'exact', head: true });

  console.log(`Table row counts:`);
  console.log(`- medicines: ${mcErr ? 'Error: ' + mcErr.message : medCount}`);
  console.log(`- phcs: ${pcErr ? 'Error: ' + pcErr.message : phcCount}`);
  console.log(`- warehouse_stock: ${wcErr ? 'Error: ' + wcErr.message : whCount}`);
}

runSeed().catch((err) => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});

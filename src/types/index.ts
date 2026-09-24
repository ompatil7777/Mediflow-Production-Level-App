export type Role = 'patient' | 'health_worker' | 'pharmacist' | 'authority' | 'supply';

export type PhcStatus = 'consulting' | 'paused' | 'closed';

export type StockStatus = 'available' | 'low' | 'out' | 'restocking';

export type RequestPriority = 'normal' | 'high' | 'critical';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'dispatched' | 'received';

export type ShipmentStatus = 'approved' | 'dispatched' | 'in_transit' | 'arrived' | 'received' | 'inventory_updated';

export type TriageUrgency = 'ROUTINE' | 'CONSULTATION' | 'URGENT';

export interface Village {
  id: string;
  name: string;
  nameMr: string;
  phcId: string;
  population: number;
}

export interface PHC {
  id: string;
  name: string;
  nameMr: string;
  status: PhcStatus;
  statusReason?: string;
  statusReasonMr?: string;
  doctorName: string;
  doctorNameMr: string;
  hwName: string;
  pharmacistName: string;
  phone: string;
  lat: number;
  lng: number;
  taluka: string;
  district: string;
  openingHours: string;
  openingHoursMr: string;
  assignedVillages: string[];
  updatedAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  nameMr: string;
  dosage: string;
  category: string;
  categoryMr: string;
}

export interface InventoryItem {
  id: string;
  phcId: string;
  medicineId: string;
  medicineName: string;
  medicineNameMr: string;
  dosage: string;
  currentStock: number;
  minThreshold: number;
  reorderPoint: number;
  safetyStock: number;
  avgDailyUsage: number;
  leadTimeDays: number;
  targetStock: number;
  status: StockStatus;
  updatedAt: string;
}

export interface StockPublic {
  phcId: string;
  phcName: string;
  phcNameMr: string;
  medicineId: string;
  medicineName: string;
  medicineNameMr: string;
  quantity: number;
  status: StockStatus;
  updatedAt: string;
}

export interface Patient {
  id: string; // e.g. "MF-P-0001"
  userId: string;
  fullName: string;
  fullNameMr: string;
  mobile: string;
  age: number;
  gender: 'M' | 'F' | 'Other';
  genderMr: string;
  villageId: string;
  villageName: string;
  villageNameMr: string;
  assignedPhcId: string;
  assignedPhcName: string;
  assignedPhcNameMr: string;
  emergencyContact: string;
  consent: boolean;
  chronicConditions: string[];
  chronicConditionsMr: string[];
  createdAt: string;
}

export interface HealthReading {
  id: string;
  patientId: string;
  type: 'bp' | 'sugar';
  systolic?: number;
  diastolic?: number;
  glucose?: number;
  readingType?: 'fasting' | 'post_meal' | 'random';
  statusLabel: string;
  statusLabelMr: string;
  recordedBy: string;
  recordedRole: Role;
  recordedAt: string;
}

export interface AppointmentSlot {
  id: string;
  phcId: string;
  date: string;
  time: string;
  capacity: number;
  booked: number;
}

export interface Appointment {
  id: string;
  phcId: string;
  phcName: string;
  phcNameMr: string;
  patientId: string;
  patientName: string;
  tokenNo: number;
  date: string;
  time: string;
  careType: string;
  careTypeMr: string;
  status: 'booked' | 'checked_in' | 'consultation' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ReorderRequest {
  id: string;
  phcId: string;
  phcName: string;
  phcNameMr: string;
  medicineId: string;
  medicineName: string;
  medicineNameMr: string;
  requestedQty: number;
  priority: RequestPriority;
  reason: string;
  reasonMr: string;
  status: RequestStatus;
  rejectionReason?: string;
  rejectionReasonMr?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentHistoryStep {
  status: ShipmentStatus;
  actorId: string;
  actorName: string;
  actorRole: string;
  actorRoleMr: string;
  timestamp: string;
  note?: string;
  noteMr?: string;
}

export interface Shipment {
  id: string;
  requestId: string;
  phcId: string;
  phcName: string;
  phcNameMr: string;
  medicineId: string;
  medicineName: string;
  medicineNameMr: string;
  quantity: number;
  status: ShipmentStatus;
  vehicleNumber?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  receivedAt?: string;
  steps: ShipmentHistoryStep[];
}

export interface WarehouseStockItem {
  medicineId: string;
  medicineName: string;
  medicineNameMr: string;
  quantity: number;
  minBuffer: number;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  actorRoleMr: string;
  action: string;
  entity: string;
  entityId: string;
  previousValue: string;
  newValue: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  category: 'inventory' | 'appointment' | 'approval' | 'shipment' | 'clinical';
  phcId?: string;
  phcName?: string;
  message: string;
  messageMr: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  role: Role;
  fullName: string;
  fullNameMr: string;
  phone: string;
  email: string;
  phcId?: string;
  phcName?: string;
  districtId: string;
  districtName: string;
  patientId?: string;
}

import { store } from '../data/store';
import { HealthReading, Patient } from '../types';

export const readingsService = {
  getPatients(phcId?: string): Patient[] {
    if (!phcId) return store.patients;
    return store.patients.filter((p) => p.assignedPhcId === phcId);
  },

  getPatient(id: string): Patient | undefined {
    return store.patients.find((p) => p.id === id);
  },

  getReadings(patientId?: string): HealthReading[] {
    if (!patientId) return store.healthReadings;
    return store.healthReadings.filter((r) => r.patientId === patientId);
  },

  record_reading(reading: Omit<HealthReading, 'id' | 'recordedAt'>): HealthReading {
    return store.record_reading(reading);
  },
};

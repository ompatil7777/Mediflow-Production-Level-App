import { store } from '../data/store';
import { Appointment, AppointmentSlot, PHC, PhcStatus } from '../types';

export const appointmentsService = {
  getPhcs(): PHC[] {
    return store.phcs;
  },

  getPhc(id: string): PHC | undefined {
    return store.phcs.find((p) => p.id === id);
  },

  getAppointments(phcId?: string, patientId?: string): Appointment[] {
    let list = store.appointments;
    if (phcId) {
      list = list.filter((a) => a.phcId === phcId);
    }
    if (patientId) {
      list = list.filter((a) => a.patientId === patientId);
    }
    return list;
  },

  getSlots(phcId: string, date: string): AppointmentSlot[] {
    return store.appointmentSlots.filter((s) => s.phcId === phcId && s.date === date);
  },

  book_appointment(
    phcId: string,
    date: string,
    time: string,
    careType: string,
    careTypeMr: string,
    patientId: string,
    patientName: string
  ): Appointment {
    return store.book_appointment(phcId, date, time, careType, careTypeMr, patientId, patientName);
  },

  set_phc_status(phcId: string, status: PhcStatus, reason?: string, reasonMr?: string): void {
    store.set_phc_status(phcId, status, reason, reasonMr);
  },
};

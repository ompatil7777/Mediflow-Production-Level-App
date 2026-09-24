import { store } from '../data/store';
import { UserProfile, Role } from '../types';
import { DEMO_PROFILES } from '../data/mockData';

export interface SignInInput {
  identifier: string; // phone number or staff id
  password?: string;
  role?: Role;
}

export const authService = {
  getCurrentUser(): UserProfile {
    return store.currentProfile;
  },

  getAllDemoProfiles(): UserProfile[] {
    return DEMO_PROFILES;
  },

  signInWithDemoRole(role: Role): UserProfile {
    store.setDemoRole(role);
    return store.currentProfile;
  },

  signInPatient(phone: string): { success: boolean; user?: UserProfile; error?: string } {
    // Stage A: map number to demo user
    const profile = DEMO_PROFILES.find((p) => p.role === 'patient');
    if (phone === '9876543210' && profile) {
      store.setDemoRole('patient');
      return { success: true, user: profile };
    }
    // Allow any 10-digit number for seamless demo testing
    if (phone.length === 10 && profile) {
      store.setDemoRole('patient');
      return { success: true, user: profile };
    }
    return { success: false, error: 'Invalid mobile number. Try demo account: 9876543210' };
  },

  signInStaff(staffIdOrEmail: string): { success: boolean; user?: UserProfile; error?: string } {
    const lower = staffIdOrEmail.toLowerCase();
    if (lower.includes('hw') || lower.includes('sunita')) {
      store.setDemoRole('health_worker');
      return { success: true, user: store.currentProfile };
    }
    if (lower.includes('pharma') || lower.includes('ganesh')) {
      store.setDemoRole('pharmacist');
      return { success: true, user: store.currentProfile };
    }
    if (lower.includes('dho') || lower.includes('meena') || lower.includes('district')) {
      store.setDemoRole('authority');
      return { success: true, user: store.currentProfile };
    }
    if (lower.includes('supply') || lower.includes('rajesh')) {
      store.setDemoRole('supply');
      return { success: true, user: store.currentProfile };
    }
    // Default fallback to health worker for testing
    store.setDemoRole('health_worker');
    return { success: true, user: store.currentProfile };
  },

  signOut(): void {
    // Keep at patient profile or reset
    store.setDemoRole('patient');
  },

  registerPatient(data: {
    fullName: string;
    mobile: string;
    age: number;
    gender: 'M' | 'F' | 'Other';
    villageId: string;
    emergencyContact: string;
  }): { success: boolean; patientId: string } {
    const newId = `MF-P-00${store.patients.length + 1}`;
    store.patients.push({
      id: newId,
      userId: `usr-${Date.now()}`,
      fullName: data.fullName,
      fullNameMr: data.fullName,
      mobile: data.mobile,
      age: data.age,
      gender: data.gender,
      genderMr: data.gender === 'M' ? 'पुरुष' : 'महिला',
      villageId: data.villageId,
      villageName: 'Shivapur',
      villageNameMr: 'शिवापूर',
      assignedPhcId: 'phc-shivapur',
      assignedPhcName: 'PHC Shivapur',
      assignedPhcNameMr: 'प्रा. आ. केंद्र शिवापूर',
      emergencyContact: data.emergencyContact,
      consent: true,
      chronicConditions: [],
      chronicConditionsMr: [],
      createdAt: new Date().toISOString(),
    });
    return { success: true, patientId: newId };
  },
};

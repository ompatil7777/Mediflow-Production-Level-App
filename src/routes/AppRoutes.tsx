import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppShell } from '../layouts/AppShell';

// Auth Pages (All 15 screens)
import { Splash } from '../pages/auth/Splash';
import { Onboarding1 } from '../pages/auth/Onboarding1';
import { Onboarding2 } from '../pages/auth/Onboarding2';
import { Onboarding3 } from '../pages/auth/Onboarding3';
import { Welcome } from '../pages/auth/Welcome';
import { PatientSignIn } from '../pages/auth/PatientSignIn';
import { PatientSignInStates } from '../pages/auth/PatientSignInStates';
import { RegisterStep1 } from '../pages/auth/RegisterStep1';
import { RegisterStep2 } from '../pages/auth/RegisterStep2';
import { RegisterConsent } from '../pages/auth/RegisterConsent';
import { RegisterSuccess } from '../pages/auth/RegisterSuccess';
import { StaffSignIn } from '../pages/auth/StaffSignIn';
import { DemoRolePicker } from '../pages/auth/DemoRolePicker';
import { Settings } from '../pages/auth/Settings';
import { SignOutConfirmation } from '../pages/auth/SignOutConfirmation';
import { PatientHome } from '../pages/patient/PatientHome';
import { NearbyPHCs } from '../pages/patient/NearbyPHCs';
import { SymptomCheck } from '../pages/patient/SymptomCheck';
import { MedicineStock } from '../pages/patient/MedicineStock';
import { MyHealth } from '../pages/patient/MyHealth';
import { BookAppointment } from '../pages/patient/BookAppointment';
import { HealthWorkerDashboard } from '../pages/health-worker/HealthWorkerDashboard';
import { HealthWorkerPatients } from '../pages/health-worker/HealthWorkerPatients';
import { HealthWorkerQueue } from '../pages/health-worker/HealthWorkerQueue';
import { HealthWorkerRecordReading } from '../pages/health-worker/HealthWorkerRecordReading';
import { PharmacistInventory } from '../pages/pharmacist/PharmacistInventory';
import { PharmacistRequests } from '../pages/pharmacist/PharmacistRequests';
import { PharmacistDemand } from '../pages/pharmacist/PharmacistDemand';
import { PharmacistHistory } from '../pages/pharmacist/PharmacistHistory';
import { DistrictOverview } from '../pages/authority/DistrictOverview';
import { DistrictPHCs } from '../pages/authority/DistrictPHCs';
import { DistrictApprovals } from '../pages/authority/DistrictApprovals';
import { DistrictDemand } from '../pages/authority/DistrictDemand';
import { DistrictAuditTrail } from '../pages/authority/DistrictAuditTrail';
import { SupplyDashboard } from '../pages/supply/SupplyDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Auth Layout Screens */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/onboarding/1" element={<Onboarding1 />} />
        <Route path="/onboarding/2" element={<Onboarding2 />} />
        <Route path="/onboarding/3" element={<Onboarding3 />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/auth/patient-signin" element={<PatientSignIn />} />
        <Route path="/auth/patient-signin-states" element={<PatientSignInStates />} />
        <Route path="/auth/register/step-1" element={<RegisterStep1 />} />
        <Route path="/auth/register/step-2" element={<RegisterStep2 />} />
        <Route path="/auth/register/consent" element={<RegisterConsent />} />
        <Route path="/auth/register/success" element={<RegisterSuccess />} />
        <Route path="/auth/staff-signin" element={<StaffSignIn />} />
        <Route path="/demo-roles" element={<DemoRolePicker />} />
        <Route path="/auth/signout" element={<SignOutConfirmation />} />
      </Route>

      {/* App Shell Screens (Main Navigation) */}
      <Route element={<AppShell />}>
        <Route path="/settings" element={<Settings />} />

        {/* Temporary Role Dashboards for Testing navigation */}
        <Route
          path="/patient/home"
          element={<PatientHome />}
        />
        <Route
          path="/patient/medicines"
          element={<MedicineStock />}
        />
        <Route
          path="/patient/my-health"
          element={<MyHealth />}
        />
        <Route
          path="/patient/book-appointment"
          element={<BookAppointment />}
        />
        <Route path="/patient/nearby-phcs" element={<NearbyPHCs />} />
        <Route path="/patient/symptom-check" element={<SymptomCheck />} />

        <Route
          path="/health-worker/dashboard"
          element={<HealthWorkerDashboard />}
        />
        <Route
          path="/health-worker/patients"
          element={<HealthWorkerPatients />}
        />
        <Route
          path="/health-worker/appointments"
          element={<HealthWorkerQueue />}
        />
        <Route
          path="/health-worker/record-reading"
          element={<HealthWorkerRecordReading />}
        />
        <Route
          path="/pharmacist/inventory"
          element={<PharmacistInventory />}
        />
        <Route
          path="/pharmacist/create-request"
          element={<PharmacistRequests />}
        />
        <Route
          path="/pharmacist/demand"
          element={<PharmacistDemand />}
        />
        <Route
          path="/pharmacist/history"
          element={<PharmacistHistory />}
        />
        <Route
          path="/district/overview"
          element={<DistrictOverview />}
        />
        <Route
          path="/district/taluka-map"
          element={<DistrictPHCs />}
        />
        <Route
          path="/district/approvals"
          element={<DistrictApprovals />}
        />
        <Route
          path="/district/demand"
          element={<DistrictDemand />}
        />
        <Route
          path="/district/audit-trail"
          element={<DistrictAuditTrail />}
        />
        <Route
          path="/supply/dashboard"
          element={<SupplyDashboard />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

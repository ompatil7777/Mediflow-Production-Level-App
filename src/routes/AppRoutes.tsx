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

// Temporary Role Placeholder until next stage build
const RoleComingSoon: React.FC<{ roleName: string; nextScreen: string }> = ({
  roleName,
  nextScreen,
}) => (
  <div className="p-6 bg-white rounded-[6px] border-[1.5px] border-surface-border text-center my-6">
    <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center mx-auto mb-3 font-bold text-lg">
      ✓
    </div>
    <h2 className="text-lg font-bold text-content-primary">{roleName} View Ready for Review</h2>
    <p className="text-xs text-content-secondary mt-1">
      Current screen: <span className="font-semibold text-brand">{nextScreen}</span>
    </p>
    <p className="text-xs text-content-muted mt-3">
      Auth/entry screens and system foundation are fully initialized. Proceeding to Patient role screens upon your approval.
    </p>
  </div>
);

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
          element={<RoleComingSoon roleName="Patient" nextScreen="Book Appointment" />}
        />
        <Route path="/patient/nearby-phcs" element={<NearbyPHCs />} />
        <Route path="/patient/symptom-check" element={<SymptomCheck />} />

        <Route
          path="/health-worker/dashboard"
          element={<RoleComingSoon roleName="Health Worker" nextScreen="HW Dashboard" />}
        />
        <Route
          path="/pharmacist/inventory"
          element={<RoleComingSoon roleName="Pharmacist" nextScreen="Pharmacist Inventory" />}
        />
        <Route
          path="/district/overview"
          element={<RoleComingSoon roleName="District Health Office" nextScreen="District Overview" />}
        />
        <Route
          path="/supply/dashboard"
          element={<RoleComingSoon roleName="Supply Depot" nextScreen="Supply Dashboard" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

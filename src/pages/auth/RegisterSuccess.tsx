import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { CheckCircle2, Building2, User } from 'lucide-react';
import { authService } from '../../services/auth';

export const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const patientId = sessionStorage.getItem('mediflow_new_patient_id') || 'MF-P-0006';
  const phcName = sessionStorage.getItem('mediflow_new_patient_phc') || 'PHC Shivapur';

  const handleGoHome = () => {
    // Automatically switch to patient role
    authService.signInWithDemoRole('patient');
    navigate('/patient/home');
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-4 text-center">
      {/* Success Icon */}
      <div className="w-16 h-16 rounded-full bg-[#F0FDF4] border-2 border-[#16A34A] flex items-center justify-center text-[#16A34A] mx-auto mb-4 shadow-sm">
        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
      </div>

      <BilingualText
        en="Registration Successful!"
        mr="नोंदणी यशस्वी झाली!"
        primaryClassName="text-2xl font-bold text-content-primary text-center"
        secondaryClassName="text-base text-content-secondary text-center mt-0.5"
      />

      <p className="text-xs text-content-muted mt-2 mb-6">
        Your account has been created in the Rural Health Demo Network
      </p>

      {/* Patient ID Card */}
      <div className="p-4 bg-white rounded-[6px] border-2 border-brand mb-4 text-left shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider mb-1">
          <User className="w-4 h-4 text-brand" />
          <span>Patient Identification Number</span>
        </div>
        <div className="text-2xl font-mono font-bold text-content-primary tracking-wide">
          {patientId}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2.5">
          <Building2 className="w-4 h-4 text-content-secondary flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs text-content-muted font-medium">Assigned Health Centre</span>
            <span className="text-sm font-bold text-content-primary">{phcName}</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          enText="Go to Patient Home"
          mrText="रुग्ण मुख्य पृष्ठावर जा"
          onClick={handleGoHome}
        />
      </div>
    </div>
  );
};

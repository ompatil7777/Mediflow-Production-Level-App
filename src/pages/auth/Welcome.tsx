import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { User, UserPlus, ShieldCheck, Sparkles } from 'lucide-react';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-2 py-4">
      {/* Title */}
      <div className="mb-6">
        <div className="w-14 h-14 mx-auto rounded-[10px] bg-brand text-white flex items-center justify-center font-bold text-2xl shadow-sm mb-3">
          M+
        </div>
        <BilingualText
          en="Welcome to MediFlow+"
          mr="MediFlow+ मध्ये आपले स्वागत आहे"
          primaryClassName="text-2xl font-bold text-content-primary text-center"
          secondaryClassName="text-base text-content-secondary text-center mt-0.5"
        />
        <p className="text-xs text-content-muted mt-2">
          Rampur Taluka · Rural Health Demo Network
        </p>
      </div>

      {/* Primary Choices */}
      <div className="w-full max-w-[340px] flex flex-col gap-3">
        <Button
          variant="primary"
          enText="Patient Sign In"
          mrText="रुग्ण साइन इन"
          icon={<User className="w-5 h-5" />}
          onClick={() => navigate('/auth/patient-signin')}
        />

        <Button
          variant="secondary"
          enText="Register as New Patient"
          mrText="नवीन रुग्ण नोंदणी"
          icon={<UserPlus className="w-5 h-5" />}
          onClick={() => navigate('/auth/register/step-1')}
        />

        <div className="my-1 flex items-center justify-center gap-2">
          <div className="h-px bg-surface-border flex-1"></div>
          <span className="text-xs text-content-muted font-medium">OR / किंवा</span>
          <div className="h-px bg-surface-border flex-1"></div>
        </div>

        <Button
          variant="outline"
          enText="Staff & Healthcare Workers"
          mrText="कर्मचारी व आरोग्य कार्यकर्ते"
          icon={<ShieldCheck className="w-5 h-5" />}
          onClick={() => navigate('/auth/staff-signin')}
        />

        <button
          onClick={() => navigate('/demo-roles')}
          className="mt-2 py-2.5 px-3 rounded-[6px] bg-brand-fixed/40 border border-brand/30 flex items-center justify-center gap-2 text-brand font-semibold text-xs hover:bg-brand-fixed/60 active:bg-brand-fixed/80 transition-none"
        >
          <Sparkles className="w-4 h-4 text-brand" />
          <span>Try Demo Roles (Instant Access) / डेमो खाती</span>
        </button>
      </div>
    </div>
  );
};

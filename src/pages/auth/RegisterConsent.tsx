import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { authService } from '../../services/auth';
import { ShieldCheck } from 'lucide-react';

export const RegisterConsent: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!agreed) {
      setError('You must agree to the data consent declaration to continue.');
      return;
    }

    const regData = JSON.parse(sessionStorage.getItem('mediflow_reg_data') || '{}');
    const res = authService.registerPatient({
      fullName: regData.fullName || 'New Villager',
      mobile: regData.mobile || '9876543299',
      age: regData.age || 40,
      gender: regData.gender || 'M',
      villageId: regData.villageId || 'vil-2',
      emergencyContact: regData.emergencyContact || '0000 000000',
    });

    sessionStorage.setItem('mediflow_new_patient_id', res.patientId);
    sessionStorage.setItem('mediflow_new_patient_phc', regData.assignedPhcName || 'PHC Shivapur');
    navigate('/auth/register/success');
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-2">
      {/* Progress header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-content-secondary font-semibold mb-1">
          <span>Step 3 of 3</span>
          <span>Consent Declaration / संमती</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-full h-full bg-brand rounded-full"></div>
        </div>
      </div>

      <div className="mb-4">
        <BilingualText
          en="Consent & Confirmation"
          mr="संमती आणि पुष्टीकरण"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary"
        />
      </div>

      {/* Consent Declaration Card */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border mb-4">
        <div className="flex items-center gap-2 mb-2 text-brand font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
          <span>Care Navigation Declaration</span>
        </div>
        <p className="text-sm text-content-secondary leading-relaxed">
          I consent to store my registration details in the Rural Health Demo Network for the sole purpose of receiving medical officer consultations, appointment bookings, and vital readings guidance.
        </p>
        <p className="text-xs text-content-muted mt-2 leading-relaxed">
          मी सल्ला, तपासणी आणि भेटीच्या नियोजनासाठी ग्रामीण आरोग्य नेटवर्ककडे माझी माहिती नोंदवण्यास संमती देतो/देते.
        </p>
      </div>

      {/* Checkbox with 48x48 min touch target */}
      <label className="min-h-[48px] flex items-center gap-3 p-2 rounded-[6px] cursor-pointer hover:bg-slate-50 active:bg-slate-100 select-none mb-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked);
            setError('');
          }}
          className="w-6 h-6 rounded-[4px] border-2 border-surface-border text-brand focus:ring-0 focus:outline-none cursor-pointer flex-shrink-0"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-content-primary leading-tight">
            I agree to the terms / मला मान्य आहे
          </span>
          <span className="text-xs text-content-secondary mt-0.5">
            Voluntary participation in demo prototype
          </span>
        </div>
      </label>

      {error && (
        <div className="p-2.5 rounded-[4px] bg-[#FEF2F2] border border-[#DC2626] text-xs font-semibold text-[#DC2626] mb-3">
          {error}
        </div>
      )}

      <div className="pt-2 flex gap-2.5">
        <Button
          type="button"
          variant="secondary"
          enText="Back"
          mrText="मागे"
          onClick={() => navigate('/auth/register/step-2')}
        />
        <Button
          type="button"
          variant="primary"
          enText="Complete Registration"
          mrText="नोंदणी पूर्ण करा"
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};

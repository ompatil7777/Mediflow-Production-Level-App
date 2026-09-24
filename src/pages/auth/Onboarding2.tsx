import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { Pill } from 'lucide-react';

export const Onboarding2: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between min-h-[500px] text-center px-3 py-4">
      {/* Top Skip */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => navigate('/welcome')}
          className="text-xs font-semibold text-content-secondary hover:text-brand px-2 py-1"
        >
          Skip / वगळा
        </button>
      </div>

      {/* Center Visual & Content */}
      <div className="flex flex-col items-center my-6">
        <div className="w-20 h-20 rounded-full bg-surface-well border-2 border-brand flex items-center justify-center text-brand mb-6 shadow-sm">
          <Pill className="w-10 h-10 stroke-[2]" />
        </div>

        <h2 className="text-xl font-bold text-content-primary mb-2">
          <BilingualText
            en="Know Before You Travel"
            mr="प्रवास करण्यापूर्वी खात्री करा"
            primaryClassName="text-xl font-bold text-content-primary text-center"
            secondaryClassName="text-base text-content-secondary text-center mt-1"
          />
        </h2>

        <div className="mt-3 max-w-[320px]">
          <BilingualText
            en="Verify real-time medicine stock at your local dispensary so you never return empty-handed."
            mr="स्थानिक दवाखान्यातील प्रत्यक्ष औषध साठा तपासा जेणेकरून तुम्हाला रिकाम्या हाताने परतावे लागणार नाही."
            primaryClassName="text-sm font-medium text-content-secondary text-center leading-relaxed"
            secondaryClassName="text-xs text-content-muted text-center mt-1 leading-relaxed"
          />
        </div>
      </div>

      {/* Step Indicators & Actions */}
      <div className="w-full max-w-[340px] flex flex-col items-center gap-5 mb-2">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-surface-border"></span>
          <span className="w-6 h-2 rounded-full bg-brand"></span>
          <span className="w-2 h-2 rounded-full bg-surface-border"></span>
        </div>

        <div className="w-full flex gap-3">
          <Button
            variant="secondary"
            enText="Back"
            mrText="मागे"
            onClick={() => navigate('/onboarding/1')}
          />
          <Button
            variant="primary"
            enText="Continue"
            mrText="पुढे चला"
            onClick={() => navigate('/onboarding/3')}
          />
        </div>
      </div>
    </div>
  );
};

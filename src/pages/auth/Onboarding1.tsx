import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { MapPin } from 'lucide-react';

export const Onboarding1: React.FC = () => {
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
          <MapPin className="w-10 h-10 stroke-[2]" />
        </div>

        <h2 className="text-xl font-bold text-content-primary mb-2">
          <BilingualText
            en="Know Where to Go"
            mr="कुठे जायचे ते जाणून घ्या"
            primaryClassName="text-xl font-bold text-content-primary text-center"
            secondaryClassName="text-base text-content-secondary text-center mt-1"
          />
        </h2>

        <div className="mt-3 max-w-[320px]">
          <BilingualText
            en="Check live doctor availability and operating hours at your nearest Primary Health Centre before you travel."
            mr="प्रवासाला निघण्यापूर्वी जवळच्या प्राथमिक आरोग्य केंद्रातील डॉक्टरांची उपस्थिती आणि वेळ तपासा."
            primaryClassName="text-sm font-medium text-content-secondary text-center leading-relaxed"
            secondaryClassName="text-xs text-content-muted text-center mt-1 leading-relaxed"
          />
        </div>
      </div>

      {/* Step Indicators & Actions */}
      <div className="w-full max-w-[340px] flex flex-col items-center gap-5 mb-2">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          <span className="w-6 h-2 rounded-full bg-brand"></span>
          <span className="w-2 h-2 rounded-full bg-surface-border"></span>
          <span className="w-2 h-2 rounded-full bg-surface-border"></span>
        </div>

        <Button
          variant="primary"
          enText="Continue"
          mrText="पुढे चला"
          onClick={() => navigate('/onboarding/2')}
        />
      </div>
    </div>
  );
};

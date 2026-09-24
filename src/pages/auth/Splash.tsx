import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';

export const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-between min-h-[500px] text-center px-2 py-4">
      {/* Brand Header */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-16 h-16 rounded-[12px] bg-brand text-white flex items-center justify-center font-bold text-3xl shadow-md mb-4 border-2 border-brand-dark">
          <span>M</span>
          <span className="text-[#16A34A] text-2xl -ml-1">+</span>
        </div>
        <h1 className="text-2xl font-bold text-brand tracking-tight">MediFlow+</h1>
        <p className="text-sm font-semibold text-content-secondary mt-1">
          Rural Health Demo Network
        </p>
        <div className="mt-3 py-1 px-3 rounded-full bg-brand/10 border border-brand/20">
          <BilingualText
            en="One Connected Loop for Patient Care & Medicine Supply"
            mr="रुग्ण सेवा आणि औषध पुरवठ्याची एक जोडलेली साखळी"
            primaryClassName="text-xs font-semibold text-brand text-center"
            secondaryClassName="text-[11px] text-content-secondary text-center"
          />
        </div>
      </div>

      {/* Language Selection Card */}
      <div className="w-full max-w-[340px] bg-white rounded-[6px] border-[1.5px] border-surface-border p-4 my-6 text-left">
        <h2 className="text-sm font-bold text-content-primary mb-3">
          Select Preferred Language / भाषा निवडा
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`h-12 rounded-[6px] border-2 font-semibold text-sm flex items-center justify-center transition-none ${
              language === 'en'
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-surface-border bg-white text-content-primary hover:bg-slate-50'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('mr')}
            className={`h-12 rounded-[6px] border-2 font-semibold text-sm flex items-center justify-center transition-none ${
              language === 'mr'
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-surface-border bg-white text-content-primary hover:bg-slate-50'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Action CTA */}
      <div className="w-full max-w-[340px] flex flex-col gap-2.5 mb-2">
        <Button
          variant="primary"
          enText="Continue / पुढे चला"
          mrText="पुढे चला / Continue"
          onClick={() => navigate('/onboarding/1')}
        />
        <button
          onClick={() => navigate('/demo-roles')}
          className="text-xs font-semibold text-brand underline py-1"
        >
          Quick Demo Access / डेमो खाती
        </button>
      </div>
    </div>
  );
};

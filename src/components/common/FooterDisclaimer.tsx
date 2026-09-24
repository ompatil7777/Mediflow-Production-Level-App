import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const FooterDisclaimer: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="mt-8 mb-4 px-4 text-center select-none">
      <div className="py-2.5 px-3 rounded-[6px] bg-surface-well border border-surface-border inline-block w-full">
        <p className="text-xs font-semibold text-content-secondary">
          {language === 'mr'
            ? 'डेमो वातावरण. सर्व माहिती काल्पनिक आहे.'
            : 'Demo environment. All data is fictional.'}
        </p>
        <p className="text-[11px] text-content-muted mt-1">
          {language === 'mr'
            ? 'आणीबाणी: रुग्णवाहिका १०८ (केवळ माहितीसाठी, थेट कॉल नाही)'
            : 'Emergency: Ambulance 108 (Informational only, no direct call)'}
        </p>
        <p className="text-[11px] text-content-muted mt-0.5">
          {language === 'mr'
            ? 'केवळ काळजी-मार्गदर्शन. हे वैद्यकीय उपकरण नाही.'
            : 'Care-navigation guidance only. Not a medical device.'}
        </p>
      </div>
    </footer>
  );
};

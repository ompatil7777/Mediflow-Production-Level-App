import React, { createContext, useContext, useState } from 'react';
import en from '../i18n/en.json';
import mr from '../i18n/mr.json';

type Language = 'en' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string>) => string;
  getBilingual: (enText: string, mrText?: string) => { primary: string; secondary: string };
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('mediflow_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mediflow_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const dict = language === 'mr' ? mr : en;
    const keys = key.split('.');
    let value: any = dict;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if missing in Marathi
        let fallbackVal: any = en;
        for (const fk of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fk in fallbackVal) {
            fallbackVal = fallbackVal[fk];
          } else {
            return key;
          }
        }
        value = fallbackVal;
        break;
      }
    }

    if (typeof value === 'string') {
      let str = value;
      if (params) {
        Object.entries(params).forEach(([pKey, pVal]) => {
          str = str.replace(new RegExp(`{{${pKey}}}`, 'g'), pVal);
        });
      }
      return str;
    }
    return key;
  };

  /**
   * Bilingual Stacking Rule:
   * When English is selected: English is primary (16px SemiBold), Marathi is secondary (14px Regular).
   * When Marathi is selected: Marathi is primary (16px SemiBold), English is secondary (14px Regular).
   */
  const getBilingual = (enText: string, mrText?: string) => {
    const effectiveMr = mrText || enText;
    if (language === 'mr') {
      return {
        primary: effectiveMr,
        secondary: enText !== effectiveMr ? enText : '',
      };
    }
    return {
      primary: enText,
      secondary: effectiveMr !== enText ? effectiveMr : '',
    };
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getBilingual }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

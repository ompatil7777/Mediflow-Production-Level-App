import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface BilingualTextProps {
  en: string;
  mr?: string;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  inline?: boolean;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  en,
  mr,
  className = '',
  primaryClassName = 'text-base font-semibold text-content-primary',
  secondaryClassName = 'text-sm font-normal text-content-secondary',
  inline = false,
}) => {
  const { getBilingual } = useLanguage();
  const { primary, secondary } = getBilingual(en, mr);

  if (inline) {
    return (
      <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
        <span className={primaryClassName}>{primary}</span>
        {secondary && <span className={secondaryClassName}>/ {secondary}</span>}
      </span>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <span className={primaryClassName}>{primary}</span>
      {secondary && <span className={`mt-0.5 ${secondaryClassName}`}>{secondary}</span>}
    </div>
  );
};

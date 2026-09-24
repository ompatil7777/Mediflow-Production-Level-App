import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  labelEn: string;
  labelMr?: string;
  errorEn?: string;
  errorMr?: string;
  helperTextEn?: string;
  helperTextMr?: string;
}

export const Input: React.FC<InputProps> = ({
  labelEn,
  labelMr,
  errorEn,
  errorMr,
  helperTextEn,
  helperTextMr,
  className = '',
  id,
  ...props
}) => {
  const { getBilingual } = useLanguage();
  const label = getBilingual(labelEn, labelMr);
  const error = errorEn ? getBilingual(errorEn, errorMr) : null;
  const helper = helperTextEn ? getBilingual(helperTextEn, helperTextMr) : null;
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="w-full flex flex-col mb-4">
      <label htmlFor={inputId} className="mb-1.5 flex items-baseline gap-1.5 cursor-pointer">
        <span className="text-base font-bold text-content-primary">{label.primary}</span>
        {label.secondary && (
          <span className="text-sm font-normal text-content-secondary">/ {label.secondary}</span>
        )}
      </label>

      <input
        id={inputId}
        className={`h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 ${
          error ? 'border-[#DC2626]' : 'border-surface-border focus:border-brand'
        } focus:outline-none transition-none ${className}`}
        {...props}
      />

      {error ? (
        <div className="flex items-center gap-1.5 mt-1.5 text-[#DC2626] text-sm font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error.primary}</span>
          {error.secondary && <span className="opacity-90">({error.secondary})</span>}
        </div>
      ) : helper ? (
        <span className="text-xs text-content-secondary mt-1">
          {helper.primary} {helper.secondary && `(${helper.secondary})`}
        </span>
      ) : null}
    </div>
  );
};

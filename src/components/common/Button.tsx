import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  enText: string;
  mrText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  enText,
  mrText,
  icon,
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const { getBilingual } = useLanguage();
  const { primary, secondary } = getBilingual(enText, mrText);

  let variantStyles = 'bg-brand text-white hover:bg-[#09394a] active:bg-[#072a38]';
  if (variant === 'secondary' || variant === 'outline') {
    variantStyles =
      'bg-white text-brand border-2 border-brand hover:bg-slate-50 active:bg-slate-100';
  } else if (variant === 'destructive') {
    variantStyles =
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B]';
  }

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed bg-slate-300 border-slate-300 text-slate-500 hover:bg-slate-300 active:bg-slate-300'
    : '';

  return (
    <button
      disabled={disabled}
      className={`h-[52px] min-h-[48px] px-4 rounded-[6px] font-semibold text-base flex items-center justify-center gap-2 transition-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${variantStyles} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <div className="flex flex-col items-center leading-tight">
        <span>{primary}</span>
        {secondary && secondary !== primary && (
          <span className="text-xs font-normal opacity-90">{secondary}</span>
        )}
      </div>
    </button>
  );
};

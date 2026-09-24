import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AlertOctagon } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  titleEn?: string;
  titleMr?: string;
  messageEn?: string;
  messageMr?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  titleEn = 'Unable to Load Data',
  titleMr = 'माहिती लोड करण्यात अडचण',
  messageEn = 'Please verify local network connectivity or retry the operation.',
  messageMr = 'कृपया स्थानिक नेटवर्क तपासा किंवा पुन्हा प्रयत्न करा.',
  onRetry,
}) => {
  const { getBilingual } = useLanguage();
  const title = getBilingual(titleEn, titleMr);
  const msg = getBilingual(messageEn, messageMr);

  return (
    <div className="w-full p-6 bg-[#FEF2F2] rounded-[6px] border-2 border-[#DC2626] flex flex-col items-center text-center my-4">
      <div className="w-12 h-12 rounded-full bg-white border border-[#DC2626] flex items-center justify-center text-[#DC2626] mb-3 shadow-sm">
        <AlertOctagon className="w-6 h-6 stroke-[2.5]" />
      </div>
      <h3 className="text-base font-bold text-[#DC2626] leading-snug">
        {title.primary}
      </h3>
      {title.secondary && (
        <p className="text-sm text-[#991B1B] mt-0.5">{title.secondary}</p>
      )}
      <p className="text-sm text-content-secondary mt-2 max-w-[280px]">
        {msg.primary}
      </p>
      {msg.secondary && (
        <p className="text-xs text-content-secondary mt-0.5 max-w-[280px]">
          {msg.secondary}
        </p>
      )}
      {onRetry && (
        <div className="mt-4 w-full max-w-[200px]">
          <Button
            variant="primary"
            enText="Try Again"
            mrText="पुन्हा प्रयत्न करा"
            onClick={onRetry}
          />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { WifiOff } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';

export const PatientOfflineNotice: React.FC = () => {
  const { isOnline } = useSync();
  const { getBilingual } = useLanguage();

  if (isOnline) return null;

  const title = getBilingual('Offline mode', 'ऑफलाइन मोड');
  const message = getBilingual(
    'Showing saved data. Read-only actions are available until you reconnect.',
    'जतन केलेली माहिती दाखवत आहोत. पुन्हा जोडणी होईपर्यंत फक्त वाचन उपलब्ध आहे.',
  );

  return (
    <div className="flex items-start gap-2.5 p-3 bg-[#FFFBEB] border border-[#D97706] rounded-[6px]">
      <WifiOff className="w-5 h-5 text-[#D97706] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-[#92400E]">{title.primary}</p>
        {title.secondary && <p className="text-xs text-[#92400E]">{title.secondary}</p>}
        <p className="text-sm text-content-secondary mt-1">{message.primary}</p>
        {message.secondary && <p className="text-xs text-content-secondary">{message.secondary}</p>}
      </div>
    </div>
  );
};
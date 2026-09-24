import React from 'react';
import { useSync } from '../../context/SyncContext';
import { useLanguage } from '../../context/LanguageContext';
import { RefreshCw, WifiOff, Check } from 'lucide-react';

export const SubHeaderSync: React.FC = () => {
  const { isOnline, lastSyncedText, isSyncing, justReconnected, triggerSync } = useSync();
  const { language } = useLanguage();

  if (!isOnline) {
    return (
      <div className="h-9 w-full bg-[#FEF2F2] border-b border-[#FCA5A5] px-4 flex items-center justify-between text-xs font-semibold text-[#B91C1C]">
        <div className="flex items-center gap-1.5 truncate">
          <WifiOff className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">
            {language === 'mr'
              ? 'ऑफलाइन मोड: सेव्ह केलेला डेटा दाखवत आहे.'
              : 'You are offline. Showing cached data.'}
          </span>
        </div>
        <span className="text-[11px] underline opacity-90">Read-Only</span>
      </div>
    );
  }

  if (justReconnected) {
    return (
      <div className="h-9 w-full bg-[#F0FDF4] border-b border-[#86EFAC] px-4 flex items-center justify-between text-xs font-semibold text-[#15803D]">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 flex-shrink-0 stroke-[3]" />
          <span>
            {language === 'mr' ? 'पुन्हा ऑनलाइन आले. समक्रमित होत आहे...' : 'Back online. Syncing changes...'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-9 w-full bg-surface-well border-b border-surface-border px-4 flex items-center justify-between text-xs text-content-secondary font-medium select-none">
      <div className="flex items-center gap-1.5">
        <button
          onClick={triggerSync}
          disabled={isSyncing}
          className="p-1 -ml-1 rounded hover:bg-slate-200 active:scale-95 transition-none"
          title="Manual refresh"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-content-secondary ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
        <span>
          {isSyncing
            ? language === 'mr'
              ? 'समक्रमित होत आहे...'
              : 'Syncing updates...'
            : language === 'mr'
            ? `शेवटचे समक्रमित: ${lastSyncedText === 'just now' ? 'आत्ताच' : '२ मिनिटांपूर्वी'}`
            : `Last synced: ${lastSyncedText}`}
        </span>
      </div>

      <span className="text-[11px] text-content-muted">Rampur Taluka Network</span>
    </div>
  );
};

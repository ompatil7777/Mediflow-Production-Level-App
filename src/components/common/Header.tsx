import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { Link } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { toggleLanguage } = useLanguage();
  const { isLive, isOnline, toggleOnline } = useSync();

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-brand text-white flex items-center justify-between px-4 shadow-sm border-b border-brand-dark select-none">
      {/* Brand & Logo */}
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[6px] bg-white flex items-center justify-center font-bold text-brand text-lg shadow-sm">
          <span className="text-[#0C4A60]">M</span>
          <span className="text-[#16A34A] text-sm -ml-0.5">+</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-white leading-none">
            MediFlow+
          </span>
          <span className="text-[11px] text-brand-fixed leading-tight font-medium mt-0.5">
            Rural Health Network
          </span>
        </div>
      </Link>

      {/* Right Controls: Live Badge, Language Toggle, Role Indicator */}
      <div className="flex items-center gap-2">
        {/* Live / Offline Badge */}
        <button
          onClick={toggleOnline}
          title="Click to toggle Online/Offline simulation"
          className="h-8 px-2.5 rounded-full bg-[#083344] border border-[#104c63] flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          {isOnline && isLive ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
              </span>
              <span className="text-xs font-semibold text-white">Live</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-[#DC2626]"></span>
              <span className="text-xs font-semibold text-[#FFB77D]">Offline</span>
            </>
          )}
        </button>

        {/* Language Toggle: Always reads "English | मराठी" */}
        <button
          onClick={toggleLanguage}
          className="h-8 px-2.5 rounded-full bg-[#083344] hover:bg-[#0b4257] active:bg-[#062430] border border-[#104c63] text-xs font-semibold text-white tracking-wide transition-none"
        >
          English | मराठी
        </button>

        {/* Demo Role Switcher Quick Link */}
        <Link
          to="/demo-roles"
          title="Switch Role"
          className="h-8 w-8 rounded-full bg-[#083344] border border-[#104c63] flex items-center justify-center text-white hover:bg-[#0b4257]"
        >
          <UserCheck className="w-4 h-4 text-brand-fixed" />
        </Link>
      </div>
    </header>
  );
};

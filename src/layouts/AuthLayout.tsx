import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { FooterDisclaimer } from '../components/common/FooterDisclaimer';

export const AuthLayout: React.FC = () => {
  const { toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-mobile min-h-screen bg-surface-ground border-x border-slate-200 flex flex-col justify-between p-4 shadow-lg">
        {/* Minimal Auth Header */}
        <div className="flex items-center justify-between py-2 border-b border-surface-border">
          <Link to="/welcome" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[4px] bg-brand text-white flex items-center justify-center font-bold text-sm">
              M+
            </div>
            <span className="font-bold text-brand tracking-tight">MediFlow+</span>
          </Link>

          <button
            onClick={toggleLanguage}
            className="h-8 px-2.5 rounded-full bg-surface-well border border-surface-border text-xs font-semibold text-content-primary hover:bg-slate-200 transition-none"
          >
            English | मराठी
          </button>
        </div>

        {/* Auth Content */}
        <div className="flex-1 flex flex-col justify-center my-4">
          <Outlet />
        </div>

        {/* Footer Disclaimer */}
        <FooterDisclaimer />
      </div>
    </div>
  );
};

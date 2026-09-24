import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { SubHeaderSync } from '../components/common/SubHeaderSync';
import { BottomNav } from '../components/common/BottomNav';
import { FooterDisclaimer } from '../components/common/FooterDisclaimer';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile-first viewport container: max 430px, centered on desktop */}
      <div className="w-full max-w-mobile min-h-screen bg-surface-ground border-x border-slate-200 flex flex-col relative pb-20 shadow-lg">
        <Header />
        <SubHeaderSync />
        <main className="flex-1 p-4 flex flex-col">
          <Outlet />
        </main>
        <FooterDisclaimer />
        <BottomNav />
      </div>
    </div>
  );
};

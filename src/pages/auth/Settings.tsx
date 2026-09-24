import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Globe,
  Database,
  Wifi,
  LogOut,
  Users,
  Shield,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { isOnline, toggleOnline } = useSync();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const confirmSignOut = () => {
    signOut();
    setShowSignOutModal(false);
    navigate('/welcome');
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Screen Title */}
      <div className="mb-2">
        <BilingualText
          en="Profile & Settings"
          mr="माहिती आणि सेटिंग्ज"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-xs text-content-muted mt-1">
          Active Account: {user.fullName} ({user.role})
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
            {user.fullName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-content-primary">
              {user.fullName} / {user.fullNameMr}
            </span>
            <span className="text-xs font-semibold text-brand mt-0.5">
              Role: {user.role.toUpperCase()}
            </span>
            <span className="text-xs text-content-muted mt-0.5">
              {user.phcName || 'Central District Office'} · {user.districtName}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-content-secondary">Contact: {user.phone}</span>
          <button
            onClick={() => navigate('/demo-roles')}
            className="font-bold text-brand flex items-center gap-1 hover:underline"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Role</span>
          </button>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-brand" />
          <span className="text-sm font-bold text-content-primary">
            Language / भाषा निवडा
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setLanguage('en')}
            className={`h-11 rounded-[6px] border-2 font-semibold text-sm flex items-center justify-center transition-none ${
              language === 'en'
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-surface-border bg-white text-content-primary'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('mr')}
            className={`h-11 rounded-[6px] border-2 font-semibold text-sm flex items-center justify-center transition-none ${
              language === 'mr'
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-surface-border bg-white text-content-primary'
            }`}
          >
            मराठी
          </button>
        </div>
      </div>

      {/* Network & Offline Simulation */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-brand" />
            <span className="text-sm font-bold text-content-primary">
              Connectivity Simulation
            </span>
          </div>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-[4px] ${
              isOnline ? 'bg-[#F0FDF4] text-[#16A34A]' : 'bg-[#FEF2F2] text-[#DC2626]'
            }`}
          >
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        <p className="text-xs text-content-secondary">
          Toggle offline mode to test cached read-only fallback behavior in low-connectivity rural field scenarios.
        </p>
        <button
          onClick={toggleOnline}
          className="mt-1 h-9 rounded-[4px] border border-surface-border bg-surface-well font-semibold text-xs text-content-primary hover:bg-slate-200 transition-none"
        >
          {isOnline ? 'Simulate Network Disconnection' : 'Restore Online Connectivity'}
        </button>
      </div>

      {/* System Information Card */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border flex flex-col gap-2">
        <div className="flex items-center gap-2 text-content-primary font-bold text-sm">
          <Database className="w-4 h-4 text-brand" />
          <span>Application Specifications</span>
        </div>
        <div className="text-xs text-content-secondary space-y-1">
          <div>Environment: <span className="font-semibold">Rural Health Demo Network</span></div>
          <div>Location: <span className="font-semibold">Demo District, Rampur Taluka</span></div>
          <div>Stage: <span className="font-semibold">Stage A (UI Prototype & In-Memory Store)</span></div>
          <div>Storage: <span className="font-semibold">Local Cache Active</span></div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-2">
        <Button
          variant="outline"
          enText="Sign Out / साइन आउट करा"
          mrText="साइन आउट करा / Sign Out"
          icon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowSignOutModal(true)}
        />
      </div>

      {/* Sign Out Confirmation Modal */}
      <Modal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        title={
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-content-primary">
              Sign Out Confirmation
            </h3>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-content-secondary">
            Are you sure you want to sign out? Your saved offline data will remain preserved on this device.
          </p>
          <p className="text-xs text-content-muted">
            तुम्हाला खात्री आहे की तुम्ही साइन आउट करू इच्छिता? सेव्ह केलेले ऑफलाइन रेकॉर्ड या डिव्हाइसवर सुरक्षित राहतील.
          </p>
          <div className="flex gap-2.5 pt-2">
            <Button
              variant="secondary"
              enText="Cancel"
              mrText="रद्द करा"
              onClick={() => setShowSignOutModal(false)}
            />
            <Button
              variant="destructive"
              enText="Yes, Sign Out"
              mrText="होय, साइन आउट करा"
              onClick={confirmSignOut}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

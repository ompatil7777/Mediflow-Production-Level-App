import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Role } from '../../types';
import {
  User,
  HeartHandshake,
  Pill,
  Building,
  Truck,
  ArrowRight,
} from 'lucide-react';

export const DemoRolePicker: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleSelect = (role: Role, route: string) => {
    switchRole(role);
    navigate(route);
  };

  const roles = [
    {
      role: 'patient' as Role,
      route: '/patient/home',
      nameEn: 'Ramesh Patil',
      nameMr: 'रमेश पाटील',
      roleEn: 'Patient / Villager',
      roleMr: 'रुग्ण / ग्रामस्थ',
      location: 'Shivapur Village · Assigned PHC Shivapur',
      icon: User,
      badge: 'ID: MF-P-0001',
      actionEn: 'Check medicines, book appointments, vitals',
    },
    {
      role: 'health_worker' as Role,
      route: '/health-worker/dashboard',
      nameEn: 'Sunita Gaikwad',
      nameMr: 'सुनिता गायकवाड',
      roleEn: 'Health Worker (ANM)',
      roleMr: 'आरोग्य सेविका (ANM)',
      location: 'PHC Shivapur · Rampur Taluka',
      icon: HeartHandshake,
      badge: 'Active ANM',
      actionEn: 'Manage queue, record BP/sugar, set PHC status',
    },
    {
      role: 'pharmacist' as Role,
      route: '/pharmacist/inventory',
      nameEn: 'Ganesh Jadhav',
      nameMr: 'गणेश जाधव',
      roleEn: 'PHC Pharmacist',
      roleMr: 'प्रा. आ. केंद्र औषध निर्माता',
      location: 'PHC Shivapur Dispensary',
      icon: Pill,
      badge: 'Metformin Low (84)',
      actionEn: 'Update stock, trigger reorder requests, receive supplies',
    },
    {
      role: 'authority' as Role,
      route: '/district/overview',
      nameEn: 'Dr. Meena Kulkarni',
      nameMr: 'डॉ. मीना कुलकर्णी',
      roleEn: 'District Health Office',
      roleMr: 'जिल्हा आरोग्य कार्यालय',
      location: 'Demo District Health Office',
      icon: Building,
      badge: 'Approver',
      actionEn: 'Approve requests, inspect taluka map, demand & root-cause',
    },
    {
      role: 'supply' as Role,
      route: '/supply/dashboard',
      nameEn: 'Rajesh Pawar',
      nameMr: 'राजेश पवार',
      roleEn: 'Supply Depot Officer',
      roleMr: 'पुरवठा डेपो अधिकारी',
      location: 'District Central Medical Store Depot',
      icon: Truck,
      badge: 'Warehouse & Dispatch',
      actionEn: 'Warehouse stock, dispatch orders, track vehicle shipments',
    },
  ];

  return (
    <div className="w-full max-w-[390px] mx-auto py-2">
      <div className="text-center mb-5">
        <BilingualText
          en="Choose a Demo Persona"
          mr="डेमो भूमिका निवडा"
          primaryClassName="text-2xl font-bold text-content-primary text-center"
          secondaryClassName="text-base text-content-secondary text-center mt-0.5"
        />
        <p className="text-xs text-content-muted mt-1.5">
          Tap any persona to experience the connected loop from that perspective
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {roles.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.role}
              onClick={() => handleSelect(item.role, item.route)}
              className="p-3.5 bg-white rounded-[6px] border-[1.5px] border-surface-border hover:border-brand active:bg-slate-50 text-left flex items-start justify-between group transition-none shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[6px] bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-content-primary leading-tight">
                      {item.nameEn}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-surface-well border border-surface-border text-content-secondary">
                      {item.badge}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-brand mt-0.5">
                    {item.roleEn} / {item.roleMr}
                  </div>
                  <div className="text-[11px] text-content-muted mt-1">
                    {item.location}
                  </div>
                  <div className="text-xs text-content-secondary mt-1 font-medium">
                    {item.actionEn}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-brand flex-shrink-0 mt-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

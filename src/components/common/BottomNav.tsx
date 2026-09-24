import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Home,
  HeartPulse,
  Activity,
  Calendar,
  Settings,
  LayoutDashboard,
  Users,
  ClipboardList,
  PackageCheck,
  Truck,
  TrendingUp,
  History,
  MapPin,
  CheckSquare,
  FileSearch,
  Warehouse,
  Send,
} from 'lucide-react';

interface NavItem {
  to: string;
  labelEn: string;
  labelMr: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BottomNav: React.FC = () => {
  const { role } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();

  let items: NavItem[] = [];

  switch (role) {
    case 'patient':
      items = [
        { to: '/patient/home', labelEn: 'Home', labelMr: 'मुख्य', icon: Home },
        { to: '/patient/medicines', labelEn: 'Care', labelMr: 'काळजी', icon: HeartPulse },
        { to: '/patient/my-health', labelEn: 'Health', labelMr: 'आरोग्य', icon: Activity },
        { to: '/patient/book-appointment', labelEn: 'Appointments', labelMr: 'भेटी', icon: Calendar },
        { to: '/settings', labelEn: 'Profile', labelMr: 'माहिती', icon: Settings },
      ];
      break;

    case 'health_worker':
      items = [
        { to: '/health-worker/dashboard', labelEn: 'Dashboard', labelMr: 'डॅशबोर्ड', icon: LayoutDashboard },
        { to: '/health-worker/patients', labelEn: 'Patients', labelMr: 'रुग्ण', icon: Users },
        { to: '/health-worker/appointments', labelEn: 'Queue', labelMr: 'रांग', icon: Calendar },
        { to: '/health-worker/record-reading', labelEn: 'Records', labelMr: 'नोंदी', icon: ClipboardList },
        { to: '/settings', labelEn: 'Profile', labelMr: 'माहिती', icon: Settings },
      ];
      break;

    case 'pharmacist':
      items = [
        { to: '/pharmacist/inventory', labelEn: 'Inventory', labelMr: 'साठा', icon: PackageCheck },
        { to: '/pharmacist/create-request', labelEn: 'Requests', labelMr: 'मागणी', icon: Send },
        { to: '/pharmacist/demand', labelEn: 'Demand', labelMr: 'कल', icon: TrendingUp },
        { to: '/pharmacist/history', labelEn: 'History', labelMr: 'इतिहास', icon: History },
        { to: '/settings', labelEn: 'Profile', labelMr: 'माहिती', icon: Settings },
      ];
      break;

    case 'authority':
      items = [
        { to: '/district/overview', labelEn: 'Overview', labelMr: 'आढावा', icon: LayoutDashboard },
        { to: '/district/taluka-map', labelEn: 'PHCs', labelMr: 'केंद्रे', icon: MapPin },
        { to: '/district/approvals', labelEn: 'Approvals', labelMr: 'मंजुरी', icon: CheckSquare },
        { to: '/district/demand', labelEn: 'Demand', labelMr: 'मागणी', icon: TrendingUp },
        { to: '/district/audit-trail', labelEn: 'Audit', labelMr: 'ऑडिट', icon: FileSearch },
      ];
      break;

    case 'supply':
      items = [
        { to: '/supply/dashboard', labelEn: 'Orders', labelMr: 'ऑर्डर्स', icon: ClipboardList },
        // Supply "Dispatch" tab opens the Supply Orders list filtered to "Approved, awaiting dispatch"
        { to: '/supply/orders?status=approved', labelEn: 'Dispatch', labelMr: 'वितरण', icon: Truck },
        { to: '/supply/orders', labelEn: 'Deliveries', labelMr: 'डिलिव्हरी', icon: PackageCheck },
        { to: '/supply/warehouse-stock', labelEn: 'Warehouse', labelMr: 'गोदाम', icon: Warehouse },
        { to: '/settings', labelEn: 'Profile', labelMr: 'माहिती', icon: Settings },
      ];
      break;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-mobile h-16 bg-white border-t border-surface-border z-30 flex items-center justify-around px-1 shadow-md">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          location.pathname === item.to ||
          (item.to.includes('?') &&
            location.pathname === item.to.split('?')[0] &&
            location.search === `?${item.to.split('?')[1]}`);

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] h-full rounded-[4px] select-none transition-none ${
              isActive ? 'text-brand font-bold' : 'text-content-secondary hover:text-brand'
            }`}
          >
            <div
              className={`p-1 rounded-[4px] ${
                isActive ? 'bg-brand/10 text-brand' : 'text-content-secondary'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] mt-0.5 leading-tight text-center">
              {language === 'mr' ? item.labelMr : item.labelEn}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

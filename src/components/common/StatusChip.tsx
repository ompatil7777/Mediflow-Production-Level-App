import React from 'react';
import { StockStatus, PhcStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, RefreshCw, MinusCircle } from 'lucide-react';

interface StatusChipProps {
  status: StockStatus | PhcStatus | 'pending' | 'approved' | 'rejected' | 'dispatched' | 'in_transit' | 'arrived' | 'received';
  size?: 'sm' | 'md';
  customLabel?: string;
  customLabelMr?: string;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  size = 'md',
  customLabel,
  customLabelMr,
}) => {
  const { getBilingual } = useLanguage();

  let bgClass = 'bg-slate-100';
  let borderClass = 'border-slate-300';
  let textClass = 'text-content-primary';
  let Icon = CheckCircle2;
  let labelEn = 'Available';
  let labelMr = 'उपलब्ध';

  switch (status) {
    case 'available':
    case 'consulting':
    case 'approved':
    case 'received':
      bgClass = 'bg-[#F0FDF4]';
      borderClass = 'border-[#16A34A]';
      textClass = 'text-[#16A34A]';
      Icon = CheckCircle2;
      labelEn = status === 'consulting' ? 'Consulting' : status === 'approved' ? 'Approved' : status === 'received' ? 'Received' : 'Available';
      labelMr = status === 'consulting' ? 'सुरू' : status === 'approved' ? 'मंजूर' : status === 'received' ? 'प्राप्त झाले' : 'उपलब्ध';
      break;

    case 'low':
    case 'pending':
      bgClass = 'bg-[#FFFBEB]';
      borderClass = 'border-[#D97706]';
      textClass = 'text-[#D97706]';
      Icon = AlertTriangle;
      labelEn = status === 'low' ? 'Low Stock' : 'Pending Approval';
      labelMr = status === 'low' ? 'कमी साठा' : 'मंजुरी प्रलंबित';
      break;

    case 'out':
    case 'rejected':
      bgClass = 'bg-[#FEF2F2]';
      borderClass = 'border-[#DC2626]';
      textClass = 'text-[#DC2626]';
      Icon = AlertOctagon;
      labelEn = status === 'out' ? 'Out of Stock' : 'Rejected';
      labelMr = status === 'out' ? 'साठा संपला' : 'नाकारले';
      break;

    case 'restocking':
    case 'dispatched':
    case 'in_transit':
    case 'arrived':
      bgClass = 'bg-[#EFF6FF]';
      borderClass = 'border-[#2563EB]';
      textClass = 'text-[#2563EB]';
      Icon = RefreshCw;
      labelEn = status === 'dispatched' ? 'Dispatched' : status === 'in_transit' ? 'In Transit' : status === 'arrived' ? 'Arrived' : 'Restocking';
      labelMr = status === 'dispatched' ? 'पाठवले' : status === 'in_transit' ? 'मार्गावर' : status === 'arrived' ? 'पोहोचले' : 'पुनर्भरती सुरू';
      break;

    case 'paused':
    case 'closed':
    default:
      bgClass = 'bg-[#F8FAFC]';
      borderClass = 'border-[#CBD5E1]';
      textClass = 'text-[#64748B]';
      Icon = MinusCircle;
      labelEn = status === 'paused' ? 'Paused' : status === 'closed' ? 'Closed' : 'Inactive';
      labelMr = status === 'paused' ? 'तात्पुरते बंद' : status === 'closed' ? 'बंद' : 'अक्रिय';
      break;
  }

  const { primary, secondary } = getBilingual(
    customLabel || labelEn,
    customLabelMr || labelMr
  );

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] border ${bgClass} ${borderClass} ${
        size === 'sm' ? 'h-7 text-xs' : 'h-8 text-sm'
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0 stroke-[2.5]" />
      <span className={`font-semibold ${textClass}`}>
        {primary}
        {secondary && <span className="font-normal ml-1 opacity-90">({secondary})</span>}
      </span>
    </div>
  );
};

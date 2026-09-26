import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, MapPin, Users, Phone, Clock } from 'lucide-react';
import { appointmentsService } from '../../services/appointments';
import { inventoryService } from '../../services/inventory';
import { PHC, InventoryItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

interface DistrictPHCData {
  phcs: PHC[];
  inventory: InventoryItem[];
}

const formatRelativeTime = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

export const DistrictPHCs: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [data, setData] = useState<DistrictPHCData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [expandedPhcId, setExpandedPhcId] = useState<string | null>(null);

  const loadPHCs = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        phcs: appointmentsService.getPhcs(),
        inventory: inventoryService.getInventory(),
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPHCs();
  }, []);

  const phcInventoryMap = useMemo(() => {
    const map: Record<string, InventoryItem[]> = {};
    if (!data) return map;
    for (const item of data.inventory) {
      if (!map[item.phcId]) map[item.phcId] = [];
      map[item.phcId].push(item);
    }
    return map;
  }, [data]);

  const statusCounts = useMemo(() => {
    if (!data) return { consulting: 0, paused: 0, closed: 0 };
    return data.phcs.reduce(
      (acc, phc) => {
        acc[phc.status] = (acc[phc.status] || 0) + 1;
        return acc;
      },
      { consulting: 0, paused: 0, closed: 0 } as Record<string, number>,
    );
  }, [data]);

  const toggleExpand = (phcId: string) => {
    setExpandedPhcId(expandedPhcId === phcId ? null : phcId);
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="PHC Network"
          mr="प्राथमिक केंद्रे नेटवर्क"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('All health centres in Demo District', 'डेमो जिल्ह्यातील सर्व आरोग्य केंद्रे').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadPHCs} />}

      {!isLoading && !hasError && data && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-[#F0FDF4] border-[1.5px] border-[#16A34A] rounded-[6px]">
              <p className="text-xl font-bold text-[#16A34A]">{statusCounts.consulting}</p>
              <p className="text-xs text-[#16A34A]">{getBilingual('Consulting', 'सुरू').primary}</p>
            </div>
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <p className="text-xl font-bold text-[#D97706]">{statusCounts.paused}</p>
              <p className="text-xs text-[#D97706]">{getBilingual('Paused', 'तात्पुरते बंद').primary}</p>
            </div>
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <p className="text-xl font-bold text-content-primary">{statusCounts.closed || 0}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Closed', 'बंद').primary}</p>
            </div>
          </div>

          {data.phcs.length === 0 ? (
            <EmptyState
              titleEn="No PHCs found"
              titleMr="केंद्रे सापडली नाहीत"
              descEn="No health centre records are available for this district."
              descMr="या जिल्ह्यासाठी केंद्रांच्या नोंदी उपलब्ध नाहीत."
              icon={MapPin}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {data.phcs.map((phc) => {
                const items = phcInventoryMap[phc.id] || [];
                const lowItems = items.filter((i) => i.status === 'low' || i.status === 'out');
                const isExpanded = expandedPhcId === phc.id;
                return (
                  <div key={phc.id} className="bg-white border-[1.5px] border-surface-border rounded-[6px] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleExpand(phc.id)}
                      className="w-full p-4 flex items-start justify-between gap-3 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-content-primary">
                          {getBilingual(phc.name, phc.nameMr).primary}
                        </p>
                        <p className="text-xs text-content-secondary mt-0.5">
                          {phc.taluka}
                        </p>
                      </div>
                      <StatusChip status={phc.status} size="sm" />
                    </button>

                    {isExpanded ? (
                      <div className="px-4 pb-4 border-t border-surface-border pt-3 flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-xs text-content-secondary">
                            <Users className="w-4 h-4 text-brand flex-shrink-0" />
                            <span>{getBilingual('Doctor', 'वैद्यकीय अधिकारी').primary}: {getBilingual(phc.doctorName, phc.doctorNameMr).primary}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-content-secondary">
                            <Users className="w-4 h-4 text-brand flex-shrink-0" />
                            <span>{getBilingual('Health Worker', 'आरोग्य सेवक').primary}: {phc.hwName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-content-secondary">
                            <Users className="w-4 h-4 text-brand flex-shrink-0" />
                            <span>{getBilingual('Pharmacist', 'औषध निर्माता').primary}: {phc.pharmacistName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-content-secondary">
                            <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                            <span>{phc.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-content-secondary">
                            <Clock className="w-4 h-4 text-brand flex-shrink-0" />
                            <span>{getBilingual(phc.openingHours, phc.openingHoursMr).primary}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-content-secondary">
                            <MapPin className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                            <span>{getBilingual('Serves', 'सेवा क्षेत्र').primary}: {phc.assignedVillages.join(', ')}</span>
                          </div>
                        </div>

                        {phc.statusReason && (
                          <div className="p-2.5 bg-[#FFFBEB] border border-[#D97706] rounded-[6px]">
                            <p className="text-xs font-semibold text-[#92400E]">
                              {getBilingual(phc.statusReason, phc.statusReasonMr || '').primary}
                            </p>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-content-secondary">
                              {getBilingual('Inventory summary', 'साठा सारांश').primary}
                            </p>
                            <span className="text-xs text-content-muted">
                              {items.length} {getBilingual('medicines', 'औषधे').primary}
                            </span>
                          </div>
                          {items.length === 0 ? (
                            <p className="text-xs text-content-muted">
                              {getBilingual('No inventory records', 'साठ्याच्या नोंदी नाहीत').primary}
                            </p>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-2 p-2 bg-surface-well border border-surface-border rounded-[6px]">
                                  <div className="min-w-0">
                                    <p className="text-xs font-semibold text-content-primary truncate">
                                      {getBilingual(item.medicineName, item.medicineNameMr).primary}
                                    </p>
                                    <p className="text-xs text-content-muted">
                                      {item.currentStock} {getBilingual('units', 'युनिट्स').primary}
                                    </p>
                                  </div>
                                  <StatusChip status={item.status} size="sm" />
                                </div>
                              ))}
                            </div>
                          )}
                          {lowItems.length > 0 && (
                            <p className="text-xs text-[#D97706] font-semibold mt-2">
                              {lowItems.length} {getBilingual('medicines need attention', 'औषधांना लक्ष देणे आवश्यक').primary}
                            </p>
                          )}
                        </div>

                        <p className="text-xs text-content-muted text-right">
                          {getBilingual('Updated', 'अपडेट').primary} {formatRelativeTime(phc.updatedAt)}
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {lowItems.length > 0 && (
                            <span className="text-xs text-[#D97706] font-semibold">
                              {lowItems.length} {getBilingual('stock alerts', 'साठा सूचना').primary}
                            </span>
                          )}
                          <span className="text-xs text-content-muted">
                            {phc.assignedVillages.join(', ')}
                          </span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-content-muted" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

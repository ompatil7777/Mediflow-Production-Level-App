import React, { useEffect, useState } from 'react';
import { AlertTriangle, ClipboardCheck, MapPinned, PackageSearch, TrendingUp } from 'lucide-react';
import { appointmentsService } from '../../services/appointments';
import { inventoryService } from '../../services/inventory';
import { requestsService } from '../../services/requests';
import { shipmentsService } from '../../services/shipments';
import { InventoryItem, PHC, ReorderRequest, Shipment } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

interface DistrictData {
  phcs: PHC[];
  inventory: InventoryItem[];
  requests: ReorderRequest[];
  shipments: Shipment[];
}

export const DistrictOverview: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [data, setData] = useState<DistrictData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDistrict = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        phcs: appointmentsService.getPhcs(),
        inventory: inventoryService.getInventory(),
        requests: requestsService.getRequests(),
        shipments: shipmentsService.getShipments(),
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDistrict();
  }, []);

  const lowStockCount = data?.inventory.filter((item) => item.status === 'low' || item.status === 'out').length || 0;
  const pendingCount = data?.requests.filter((request) => request.status === 'pending').length || 0;
  const activeShipments = data?.shipments.filter((shipment) => shipment.status !== 'received' && shipment.status !== 'inventory_updated') || [];

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="District Health Overview"
          mr="जिल्हा आरोग्य आढावा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Demo District · Rampur Taluka', 'डेमो जिल्हा · रामपूर तालुका').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={6} />}
      {!isLoading && hasError && <ErrorState onRetry={loadDistrict} />}

      {!isLoading && !hasError && data && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: data.phcs.length, label: 'PHCs', labelMr: 'केंद्रे', icon: MapPinned },
              { value: pendingCount, label: 'Pending approvals', labelMr: 'प्रलंबित मंजुरी', icon: ClipboardCheck },
              { value: lowStockCount, label: 'Stock alerts', labelMr: 'साठा सूचना', icon: AlertTriangle },
              { value: activeShipments.length, label: 'Active shipments', labelMr: 'सक्रिय खेपा', icon: TrendingUp },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.label} className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                  <Icon className="w-5 h-5 text-brand" />
                  <p className="text-xl font-bold text-content-primary mt-2">{metric.value}</p>
                  <p className="text-sm text-content-secondary">{getBilingual(metric.label, metric.labelMr).primary}</p>
                </div>
              );
            })}
          </div>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="PHC network status"
                mr="प्राथमिक केंद्रांचे जाळे"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <MapPinned className="w-5 h-5 text-brand" />
            </div>
            {data.phcs.length === 0 ? (
              <EmptyState
                titleEn="No PHCs found"
                titleMr="केंद्रे सापडली नाहीत"
                descEn="No PHC status records are available."
                descMr="केंद्रांच्या स्थितीच्या नोंदी उपलब्ध नाहीत."
                icon={MapPinned}
              />
            ) : (
              <div className="flex flex-col divide-y divide-surface-border mt-2">
                {data.phcs.map((phc) => (
                  <div key={phc.id} className="py-3 first:pt-2 last:pb-0 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(phc.name, phc.nameMr).primary}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">{phc.assignedVillages.join(' · ')}</p>
                    </div>
                    <StatusChip status={phc.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Approvals requiring review"
                mr="पुनरावलोकनासाठी मंजुरी"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <ClipboardCheck className="w-5 h-5 text-brand" />
            </div>
            {pendingCount === 0 ? (
              <EmptyState
                titleEn="No pending approvals"
                titleMr="प्रलंबित मंजुरी नाहीत"
                descEn="All saved reorder requests have already been decided."
                descMr="जतन केलेल्या सर्व पुनर्भरती विनंत्यांवर निर्णय झाला आहे."
                icon={ClipboardCheck}
              />
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {data.requests.filter((request) => request.status === 'pending').map((request) => (
                  <div key={request.id} className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(request.medicineName, request.medicineNameMr).primary}
                      </p>
                      <StatusChip status={request.status} size="sm" />
                    </div>
                    <p className="text-sm text-content-secondary mt-1">
                      {request.phcName} · {request.requestedQty} {getBilingual('units', 'युनिट्स').primary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center gap-2">
              <PackageSearch className="w-5 h-5 text-brand" />
              <BilingualText
                en="Supply loop"
                mr="पुरवठा साखळी"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
            </div>
            <p className="text-sm text-content-secondary mt-2">
              {getBilingual(
                `${activeShipments.length} active shipment${activeShipments.length === 1 ? '' : 's'} are being tracked across the district.`,
                `जिल्ह्यात ${activeShipments.length} सक्रिय खेपांचा मागोवा घेतला जात आहे.`,
              ).primary}
            </p>
          </section>
        </>
      )}
    </div>
  );
};
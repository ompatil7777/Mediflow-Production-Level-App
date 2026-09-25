import React, { useEffect, useState } from 'react';
import { AlertTriangle, Boxes, ClipboardList, PackageCheck } from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { requestsService } from '../../services/requests';
import { InventoryItem, ReorderRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

interface InventoryData {
  inventory: InventoryItem[];
  requests: ReorderRequest[];
}

export const PharmacistInventory: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';
  const [data, setData] = useState<InventoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadInventory = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        inventory: inventoryService.getInventory(phcId),
        requests: requestsService.getRequests(phcId),
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [phcId]);

  const lowStock = data?.inventory.filter((item) => item.status === 'low' || item.status === 'out') || [];
  const pendingRequests = data?.requests.filter((request) => request.status === 'pending') || [];

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Pharmacist Inventory"
          mr="औषधनिर्माता साठा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Public health medicine stock at your PHC', 'तुमच्या केंद्रातील सार्वजनिक आरोग्य औषध साठा').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={6} />}
      {!isLoading && hasError && <ErrorState onRetry={loadInventory} />}

      {!isLoading && !hasError && data && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <PackageCheck className="w-5 h-5 text-brand" />
              <p className="text-xl font-bold text-content-primary mt-2">{data.inventory.length}</p>
              <p className="text-sm text-content-secondary">{getBilingual('Medicines', 'औषधे').primary}</p>
            </div>
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <p className="text-xl font-bold text-[#92400E] mt-2">{lowStock.length}</p>
              <p className="text-sm text-[#92400E]">{getBilingual('Need attention', 'लक्ष देणे आवश्यक').primary}</p>
            </div>
          </div>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Inventory at your PHC"
                mr="तुमच्या केंद्रातील साठा"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <Boxes className="w-5 h-5 text-brand" />
            </div>
            {data.inventory.length === 0 ? (
              <EmptyState
                titleEn="No inventory records"
                titleMr="साठ्याच्या नोंदी नाहीत"
                descEn="This PHC has no saved medicine inventory yet."
                descMr="या केंद्रासाठी औषध साठ्याची नोंद नाही."
                icon={Boxes}
              />
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {data.inventory.map((item) => (
                  <div key={item.id} className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-content-primary">
                          {getBilingual(item.medicineName, item.medicineNameMr).primary}
                        </p>
                        <p className="text-xs text-content-secondary mt-0.5">
                          {getBilingual(item.medicineName, item.medicineNameMr).secondary}
                        </p>
                      </div>
                      <StatusChip status={item.status} size="sm" />
                    </div>
                    <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-surface-border">
                      <span className="text-sm text-content-secondary">
                        {getBilingual('Current stock', 'सध्याचा साठा').primary}
                      </span>
                      <span className="text-base font-bold text-content-primary">{item.currentStock} units</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Reorder requests"
                mr="पुनर्भरती विनंत्या"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <ClipboardList className="w-5 h-5 text-brand" />
            </div>
            {pendingRequests.length === 0 ? (
              <EmptyState
                titleEn="No pending requests"
                titleMr="प्रलंबित विनंत्या नाहीत"
                descEn="There are no reorder requests waiting for review."
                descMr="पुनरावलोकनासाठी पुनर्भरती विनंती नाही."
                icon={ClipboardList}
              />
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(request.medicineName, request.medicineNameMr).primary}
                      </p>
                      <StatusChip status={request.status} size="sm" />
                    </div>
                    <p className="text-sm text-content-secondary mt-1">
                      {request.requestedQty} {getBilingual('units requested', 'युनिट्स विनंती').primary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};
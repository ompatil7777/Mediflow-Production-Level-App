import React, { useEffect, useState } from 'react';
import { AlertTriangle, ClipboardList, PackageCheck, Truck, Warehouse } from 'lucide-react';
import { shipmentsService } from '../../services/shipments';
import { Shipment, WarehouseStockItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

interface SupplyData {
  shipments: Shipment[];
  warehouseStock: WarehouseStockItem[];
}

export const SupplyDashboard: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [data, setData] = useState<SupplyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadSupply = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        shipments: shipmentsService.getShipments(),
        warehouseStock: shipmentsService.getWarehouseStock(),
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSupply();
  }, []);

  const activeShipments = data?.shipments.filter((shipment) => shipment.status !== 'received' && shipment.status !== 'inventory_updated') || [];
  const lowWarehouseStock = data?.warehouseStock.filter((item) => item.quantity < item.minBuffer) || [];

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Supply Depot Dashboard"
          mr="पुरवठा डेपो डॅशबोर्ड"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Orders, shipments, and warehouse stock', 'ऑर्डर्स, खेपा आणि गोदाम साठा').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={6} />}
      {!isLoading && hasError && <ErrorState onRetry={loadSupply} />}

      {!isLoading && !hasError && data && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <Truck className="w-5 h-5 text-brand" />
              <p className="text-xl font-bold text-content-primary mt-2">{activeShipments.length}</p>
              <p className="text-sm text-content-secondary">{getBilingual('Active shipments', 'सक्रिय खेपा').primary}</p>
            </div>
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <p className="text-xl font-bold text-[#92400E] mt-2">{lowWarehouseStock.length}</p>
              <p className="text-sm text-[#92400E]">{getBilingual('Stock alerts', 'साठा सूचना').primary}</p>
            </div>
          </div>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Shipment tracker"
                mr="खेप मागोवा"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <Truck className="w-5 h-5 text-brand" />
            </div>
            {activeShipments.length === 0 ? (
              <EmptyState
                titleEn="No active shipments"
                titleMr="सक्रिय खेपा नाहीत"
                descEn="There are no shipments waiting for depot action."
                descMr="डेपोच्या कृतीची प्रतीक्षा करणाऱ्या खेपा नाहीत."
                icon={Truck}
              />
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {activeShipments.map((shipment) => (
                  <div key={shipment.id} className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-content-primary">
                          {getBilingual(shipment.medicineName, shipment.medicineNameMr).primary}
                        </p>
                        <p className="text-sm text-content-secondary mt-0.5">
                          {shipment.quantity} {getBilingual('units', 'युनिट्स').primary} · {shipment.phcName}
                        </p>
                      </div>
                      {shipment.status === 'inventory_updated' ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-[4px] border border-[#16A34A] bg-[#F0FDF4] text-[#166534]">
                          {getBilingual('Updated', 'अपडेट झाले').primary}
                        </span>
                      ) : (
                        <StatusChip status={shipment.status} size="sm" />
                      )}
                    </div>
                    <p className="text-xs text-content-muted mt-2">{shipment.id}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Warehouse stock"
                mr="गोदाम साठा"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <Warehouse className="w-5 h-5 text-brand" />
            </div>
            {data.warehouseStock.length === 0 ? (
              <EmptyState
                titleEn="No warehouse records"
                titleMr="गोदामाच्या नोंदी नाहीत"
                descEn="Warehouse stock is not available in the saved data."
                descMr="जतन केलेल्या माहितीमध्ये गोदाम साठा उपलब्ध नाही."
                icon={Warehouse}
              />
            ) : (
              <div className="flex flex-col gap-2 mt-3">
                {data.warehouseStock.map((item) => {
                  const isLow = item.quantity < item.minBuffer;
                  return (
                    <div key={item.medicineId} className="flex items-center justify-between gap-3 p-3 bg-surface-well border border-surface-border rounded-[6px]">
                      <div className="flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-brand flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-content-primary">
                            {getBilingual(item.medicineName, item.medicineNameMr).primary}
                          </p>
                          <p className="text-xs text-content-secondary">{item.quantity} units</p>
                        </div>
                      </div>
                      {isLow && (
                        <span className="text-xs font-semibold text-[#92400E]">
                          {getBilingual('Low buffer', 'कमी सुरक्षा साठा').primary}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <div className="p-3 bg-surface-well border border-surface-border rounded-[6px] flex items-start gap-2">
            <ClipboardList className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
            <p className="text-sm text-content-secondary">
              {getBilingual(
                'Shipment updates are read-only in this dashboard stage.',
                'या डॅशबोर्ड टप्प्यात खेप अपडेट्स फक्त वाचनासाठी आहेत.',
              ).primary}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
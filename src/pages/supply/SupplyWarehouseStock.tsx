import React, { useEffect, useMemo, useState } from 'react';
import { Warehouse, PackageCheck, AlertTriangle, Search } from 'lucide-react';
import { shipmentsService } from '../../services/shipments';
import { WarehouseStockItem } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

export const SupplyWarehouseStock: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [stock, setStock] = useState<WarehouseStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadStock = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setStock(shipmentsService.getWarehouseStock());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const filteredStock = useMemo(() => {
    if (!searchQuery.trim()) return stock;
    const q = searchQuery.trim().toLowerCase();
    return stock.filter(
      (item) =>
        item.medicineName.toLowerCase().includes(q) ||
        item.medicineNameMr.includes(searchQuery.trim()) ||
        item.medicineId.includes(q),
    );
  }, [stock, searchQuery]);

  const lowBufferCount = stock.filter((item) => item.quantity < item.minBuffer).length;
  const totalUnits = stock.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Warehouse Stock"
          mr="गोदाम साठा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Central depot inventory and buffer levels', 'केंद्रीय डेपो साठा आणि सुरक्षा पातळी').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={6} />}
      {!isLoading && hasError && <ErrorState onRetry={loadStock} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <PackageCheck className="w-5 h-5 text-brand" />
              <p className="text-xl font-bold text-content-primary mt-2">{totalUnits.toLocaleString('en-IN')}</p>
              <p className="text-sm text-content-secondary">{getBilingual('Total units', 'एकूण युनिट्स').primary}</p>
            </div>
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <AlertTriangle className="w-5 h-5 text-[#D97706]" />
              <p className="text-xl font-bold text-[#92400E] mt-2">{lowBufferCount}</p>
              <p className="text-sm text-[#92400E]">{getBilingual('Low buffer', 'कमी सुरक्षा साठा').primary}</p>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={getBilingual('Search medicines…', 'औषधे शोधा…').primary}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white rounded-[6px] text-sm font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
            />
          </div>

          {filteredStock.length === 0 ? (
            <EmptyState
              titleEn="No medicines found"
              titleMr="औषधे सापडली नाहीत"
              descEn={searchQuery.trim() ? 'Try a different search term.' : 'Warehouse stock records are not available.'}
              descMr={searchQuery.trim() ? 'वेगळा शब्द वापरून पहा.' : 'गोदाम साठा नोंदी उपलब्ध नाहीत.'}
              icon={Warehouse}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {filteredStock.map((item) => {
                const isLow = item.quantity < item.minBuffer;
                const bufferPercent = Math.min(100, Math.round((item.quantity / item.minBuffer) * 100));
                return (
                  <div key={item.medicineId} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <PackageCheck className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isLow ? 'text-[#D97706]' : 'text-brand'}`} />
                        <div>
                          <p className="text-sm font-bold text-content-primary">
                            {getBilingual(item.medicineName, item.medicineNameMr).primary}
                          </p>
                          <p className="text-xs text-content-muted mt-0.5">{item.medicineId}</p>
                        </div>
                      </div>
                      {isLow && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-[4px] border border-[#D97706] bg-[#FFFBEB] text-[#92400E]">
                          {getBilingual('Low buffer', 'कमी सुरक्षा साठा').primary}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3 pt-2 border-t border-surface-border">
                      <div>
                        <p className="text-lg font-bold text-content-primary">{item.quantity.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-content-secondary">{getBilingual('In stock', 'साठा').primary}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-content-secondary">{item.minBuffer.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-content-muted">{getBilingual('Min buffer', 'किमान साठा').primary}</p>
                      </div>
                    </div>

                    {/* Buffer level bar */}
                    <div className="mt-2">
                      <div className="h-2 bg-surface-well rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isLow ? 'bg-[#D97706]' : 'bg-[#16A34A]'}`}
                          style={{ width: `${bufferPercent}%` }}
                        />
                      </div>
                    </div>
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

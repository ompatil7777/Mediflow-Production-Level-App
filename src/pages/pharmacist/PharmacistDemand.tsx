import React, { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { store } from '../../data/store';
import { calculateDemand, DemandCalculationResult } from '../../engines/demand';
import { InventoryItem, Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

interface MedicineDemand {
  item: InventoryItem;
  calc: DemandCalculationResult;
}

export const PharmacistDemand: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDemand = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setInventory(inventoryService.getInventory(phcId));
      setPatients(store.patients.filter((p) => p.assignedPhcId === phcId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemand();
  }, [phcId]);

  const demands: MedicineDemand[] = useMemo(() => {
    const chronicCount = patients.filter((p) => p.chronicConditions.length > 0).length;
    return inventory.map((item) => ({
      item,
      calc: calculateDemand({
        movingAvgDailyUsage: item.avgDailyUsage,
        chronicPatientCount: chronicCount,
        currentStock: item.currentStock,
      }),
    }));
  }, [inventory, patients]);

  const totals = useMemo(() => {
    const totalDemand = demands.reduce((s, d) => s + d.calc.estimatedDemand, 0);
    const totalSupply = demands.reduce((s, d) => s + d.calc.currentSupply, 0);
    const totalGap = demands.reduce((s, d) => s + d.calc.gap, 0);
    return { totalDemand, totalSupply, totalGap };
  }, [demands]);

  const sortedDemands = useMemo(() => {
    return [...demands].sort((a, b) => b.calc.gap - a.calc.gap);
  }, [demands]);

  const trendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-[#D97706]" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-[#16A34A]" />;
    return <Minus className="w-4 h-4 text-content-muted" />;
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Demand Forecast"
          mr="मागणी अंदाज"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Statistical demand estimation for the next 30 days', 'पुढील ३० दिवसांसाठी सांख्यिकीय मागणी अंदाज').primary}
        </p>
      </div>

      <OfflineNotice />

      <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
        <p className="text-xs text-content-muted">
          {getBilingual('Statistical estimation, not AI', 'सांख्यिकीय अंदाज, AI नाही').primary}
        </p>
      </div>

      {isLoading && <LoadingSkeleton rows={4} />}
      {!isLoading && hasError && <ErrorState onRetry={loadDemand} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <p className="text-xl font-bold text-content-primary">{totals.totalDemand}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Est. demand', 'अंदाजित मागणी').primary}</p>
            </div>
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <p className="text-xl font-bold text-content-primary">{totals.totalSupply}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Current supply', 'सध्याचा पुरवठा').primary}</p>
            </div>
            <div className={`p-3 border-[1.5px] rounded-[6px] ${totals.totalGap > 0 ? 'bg-[#FFFBEB] border-[#D97706]' : 'bg-[#F0FDF4] border-[#16A34A]'}`}>
              <p className={`text-xl font-bold ${totals.totalGap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>{totals.totalGap}</p>
              <p className={`text-xs ${totals.totalGap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>
                {totals.totalGap > 0 ? getBilingual('Shortage', 'तोटा').primary : getBilingual('Surplus', 'अतिरिक्त').primary}
              </p>
            </div>
          </div>

          {sortedDemands.length === 0 ? (
            <EmptyState
              titleEn="No inventory to analyze"
              titleMr="विश्लेषणासाठी साठा नाही"
              descEn="Add medicines to inventory to see demand forecasts."
              descMr="मागणी अंदाज पाहण्यासाठी साठ्यात औषधे जोडा."
              icon={TrendingUp}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {sortedDemands.map(({ item, calc }) => (
                <div key={item.id} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(item.medicineName, item.medicineNameMr).primary}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {getBilingual('30-day usage avg', '३०-दिवस वापर सरासरी').primary}: {item.avgDailyUsage}/day
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {trendIcon(calc.trend)}
                      <span className="text-xs font-semibold text-content-secondary">
                        {calc.trendPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="p-2 bg-surface-well border border-surface-border rounded-[6px]">
                      <p className="text-xs text-content-muted">{getBilingual('Demand', 'मागणी').primary}</p>
                      <p className="text-base font-bold text-content-primary">{calc.estimatedDemand}</p>
                    </div>
                    <div className="p-2 bg-surface-well border border-surface-border rounded-[6px]">
                      <p className="text-xs text-content-muted">{getBilingual('Supply', 'पुरवठा').primary}</p>
                      <p className="text-base font-bold text-content-primary">{calc.currentSupply}</p>
                    </div>
                    <div className={`p-2 border rounded-[6px] ${calc.gap > 0 ? 'bg-[#FFFBEB] border-[#D97706]' : 'bg-[#F0FDF4] border-[#16A34A]'}`}>
                      <p className={`text-xs ${calc.gap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>
                        {calc.gap > 0 ? getBilingual('Gap', 'तोटा').primary : getBilingual('Surplus', 'अतिरिक्त').primary}
                      </p>
                      <p className={`text-base font-bold ${calc.gap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>{calc.gap}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-content-muted mb-1">
                      <span>{getBilingual('Supply vs Demand', 'पुरवठा वि मागणी').primary}</span>
                      <span>{Math.min(100, Math.round((calc.currentSupply / Math.max(1, calc.estimatedDemand)) * 100))}%</span>
                    </div>
                    <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${calc.gap > 0 ? 'bg-[#D97706]' : 'bg-[#16A34A]'}`}
                        style={{ width: `${Math.min(100, Math.round((calc.currentSupply / Math.max(1, calc.estimatedDemand)) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

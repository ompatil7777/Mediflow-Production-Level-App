import React, { useEffect, useMemo, useState } from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { store } from '../../data/store';
import { calculateDemand } from '../../engines/demand';
import { InventoryItem, Patient, PHC } from '../../types';
import { appointmentsService } from '../../services/appointments';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

interface DistrictDemandData {
  phcs: PHC[];
  inventory: InventoryItem[];
  patients: Patient[];
}

interface MedicineDemandAggregate {
  medicineName: string;
  medicineNameMr: string;
  medicineId: string;
  totalDemand: number;
  totalSupply: number;
  totalGap: number;
  phcCount: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  trendPercentage: number;
}

export const DistrictDemand: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [data, setData] = useState<DistrictDemandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDemand = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        phcs: appointmentsService.getPhcs(),
        inventory: inventoryService.getInventory(),
        patients: store.patients,
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemand();
  }, []);

  const aggregates: MedicineDemandAggregate[] = useMemo(() => {
    if (!data) return [];
    const medMap: Record<string, MedicineDemandAggregate> = {};
    for (const item of data.inventory) {
      const chronicCount = data.patients.filter((p) => p.assignedPhcId === item.phcId && p.chronicConditions.length > 0).length;
      const calc = calculateDemand({
        movingAvgDailyUsage: item.avgDailyUsage,
        chronicPatientCount: chronicCount,
        currentStock: item.currentStock,
      });
      const existing = medMap[item.medicineId];
      if (existing) {
        existing.totalDemand += calc.estimatedDemand;
        existing.totalSupply += calc.currentSupply;
        existing.totalGap += calc.gap;
        existing.phcCount += 1;
      } else {
        medMap[item.medicineId] = {
          medicineName: item.medicineName,
          medicineNameMr: item.medicineNameMr,
          medicineId: item.medicineId,
          totalDemand: calc.estimatedDemand,
          totalSupply: calc.currentSupply,
          totalGap: calc.gap,
          phcCount: 1,
          trend: calc.trend,
          trendPercentage: calc.trendPercentage,
        };
      }
    }
    return Object.values(medMap).sort((a, b) => b.totalGap - a.totalGap);
  }, [data]);

  const totals = useMemo(() => {
    return aggregates.reduce(
      (acc, a) => {
        acc.totalDemand += a.totalDemand;
        acc.totalSupply += a.totalSupply;
        acc.totalGap += a.totalGap;
        return acc;
      },
      { totalDemand: 0, totalSupply: 0, totalGap: 0 },
    );
  }, [aggregates]);

  const trendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-[#D97706]" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-[#16A34A]" />;
    return <Minus className="w-4 h-4 text-content-muted" />;
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="District Demand Forecast"
          mr="जिल्हा मागणी अंदाज"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('30-day demand estimation aggregated across all PHCs', 'सर्व केंद्रांचा ३०-दिवसीय मागणी अंदाज').primary}
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
                {totals.totalGap > 0 ? getBilingual('Total gap', 'एकूण तोटा').primary : getBilingual('Surplus', 'अतिरिक्त').primary}
              </p>
            </div>
          </div>

          {aggregates.length === 0 ? (
            <EmptyState
              titleEn="No demand data available"
              titleMr="मागणी डेटा उपलब्ध नाही"
              descEn="Inventory records are needed to calculate demand forecasts."
              descMr="मागणी अंदाजासाठी साठ्याच्या नोंदी आवश्यक आहेत."
              icon={TrendingUp}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {aggregates.map((agg) => (
                <div key={agg.medicineId} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(agg.medicineName, agg.medicineNameMr).primary}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {agg.phcCount} {getBilingual('PHCs', 'केंद्रे').primary}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {trendIcon(agg.trend)}
                      <span className="text-xs font-semibold text-content-secondary">{agg.trendPercentage}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="p-2 bg-surface-well border border-surface-border rounded-[6px]">
                      <p className="text-xs text-content-muted">{getBilingual('Demand', 'मागणी').primary}</p>
                      <p className="text-base font-bold text-content-primary">{agg.totalDemand}</p>
                    </div>
                    <div className="p-2 bg-surface-well border border-surface-border rounded-[6px]">
                      <p className="text-xs text-content-muted">{getBilingual('Supply', 'पुरवठा').primary}</p>
                      <p className="text-base font-bold text-content-primary">{agg.totalSupply}</p>
                    </div>
                    <div className={`p-2 border rounded-[6px] ${agg.totalGap > 0 ? 'bg-[#FFFBEB] border-[#D97706]' : 'bg-[#F0FDF4] border-[#16A34A]'}`}>
                      <p className={`text-xs ${agg.totalGap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>
                        {agg.totalGap > 0 ? getBilingual('Gap', 'तोटा').primary : getBilingual('Surplus', 'अतिरिक्त').primary}
                      </p>
                      <p className={`text-base font-bold ${agg.totalGap > 0 ? 'text-[#92400E]' : 'text-[#166534]'}`}>{agg.totalGap}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-content-muted mb-1">
                      <span>{getBilingual('Supply vs Demand', 'पुरवठा वि मागणी').primary}</span>
                      <span>{Math.min(100, Math.round((agg.totalSupply / Math.max(1, agg.totalDemand)) * 100))}%</span>
                    </div>
                    <div className="h-2 bg-surface-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${agg.totalGap > 0 ? 'bg-[#D97706]' : 'bg-[#16A34A]'}`}
                        style={{ width: `${Math.min(100, Math.round((agg.totalSupply / Math.max(1, agg.totalDemand)) * 100))}%` }}
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

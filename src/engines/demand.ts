/**
 * Demand Engine (Statistical estimation, not AI)
 * As per MEDIFLOW_SPEC.md Section 7.3
 */

export interface DemandCalculationInput {
  movingAvgDailyUsage: number;
  daysPeriod?: number; // default 30
  chronicPatientCount: number;
  currentStock: number;
}

export interface DemandCalculationResult {
  estimatedDemand: number;
  currentSupply: number;
  gap: number; // positive = shortage/gap, negative = surplus
  trend: 'increasing' | 'stable' | 'decreasing';
  trendPercentage: number;
  label: string;
  labelMr: string;
}

export function calculateDemand(input: DemandCalculationInput): DemandCalculationResult {
  const { movingAvgDailyUsage, daysPeriod = 30, chronicPatientCount, currentStock } = input;

  // Base monthly usage = moving-average daily usage * 30
  const baseMonthlyUsage = movingAvgDailyUsage * daysPeriod;
  
  // Growth factor from chronic patient load (each registered patient accounts for regular maintenance)
  const chronicAdjustment = Math.round(chronicPatientCount * 1.5);
  
  const estimatedDemand = Math.round(baseMonthlyUsage + chronicAdjustment);
  const gap = Math.max(0, estimatedDemand - currentStock);

  // Trend detection: if chronic patients > 10 or daily usage high
  const trendPercentage = chronicPatientCount > 5 ? 12 : 2;
  const trend = trendPercentage > 5 ? 'increasing' : 'stable';

  return {
    estimatedDemand,
    currentSupply: currentStock,
    gap,
    trend,
    trendPercentage,
    label: 'Statistical estimation, not AI',
    labelMr: 'सांख्यिकीय अंदाज, AI नाही',
  };
}

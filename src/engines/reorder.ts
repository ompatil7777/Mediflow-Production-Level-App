/**
 * Reorder Engine (Rule-based recommendation, not AI)
 * As per MEDIFLOW_SPEC.md Section 7.2:
 * ReorderPoint = AvgDailyUsage * LeadTimeDays + SafetyStock
 * SuggestedQty = TargetStock - CurrentStock
 * DaysRemaining = CurrentStock / AvgDailyUsage
 */

export interface ReorderCalculationInput {
  currentStock: number;
  avgDailyUsage: number;
  leadTimeDays: number;
  safetyStock: number;
  targetStock: number;
}

export interface ReorderCalculationResult {
  reorderPoint: number;
  isReorderRecommended: boolean;
  suggestedQty: number;
  daysRemaining: number;
  formulaDescription: string;
  formulaDescriptionMr: string;
}

export function calculateReorder(input: ReorderCalculationInput): ReorderCalculationResult {
  const { currentStock, avgDailyUsage, leadTimeDays, safetyStock, targetStock } = input;
  
  // ReorderPoint = (AvgDailyUsage * LeadTimeDays) + SafetyStock
  const reorderPoint = Math.round(avgDailyUsage * leadTimeDays + safetyStock);
  const isReorderRecommended = currentStock < reorderPoint;
  
  // SuggestedQty = TargetStock - CurrentStock (minimum 0)
  const suggestedQty = Math.max(0, targetStock - currentStock);
  
  // DaysRemaining = CurrentStock / AvgDailyUsage
  const daysRemaining = avgDailyUsage > 0 ? Math.round((currentStock / avgDailyUsage) * 10) / 10 : 999;

  return {
    reorderPoint,
    isReorderRecommended,
    suggestedQty,
    daysRemaining,
    formulaDescription: `Rule-based: (${avgDailyUsage} daily usage × ${leadTimeDays} days lead time) + ${safetyStock} safety stock = ${reorderPoint} units reorder point.`,
    formulaDescriptionMr: `नियम-आधारित: (${avgDailyUsage} दैनिक वापर × ${leadTimeDays} दिवस वितरण वेळ) + ${safetyStock} सुरक्षा साठा = ${reorderPoint} युनिट्स पुनर्भरती बिंदू.`,
  };
}

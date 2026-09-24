/**
 * Root Cause Classifier (Rule-based engine, not AI)
 * As per MEDIFLOW_SPEC.md Section 7.5
 */

export type RootCauseCategory =
  | 'APPROVAL_DELAY'
  | 'SUPPLY_DELAY'
  | 'UNEXPECTED_DEMAND'
  | 'WAREHOUSE_SHORTAGE'
  | 'DATA_ENTRY_ISSUE'
  | 'NONE_NORMAL';

export interface RootCauseInvestigation {
  category: RootCauseCategory;
  title: string;
  titleMr: string;
  explanation: string;
  explanationMr: string;
  ruleTriggered: string;
  ruleTriggeredMr: string;
  recommendedAction: string;
  recommendedActionMr: string;
}

export interface RootCauseInput {
  hoursPendingApproval?: number;
  daysInTransit?: number;
  expectedLeadTimeDays?: number;
  usage7DayAvg?: number;
  usage30DayAvg?: number;
  warehouseStock?: number;
  requestedQty?: number;
  manualAdjustmentPercent?: number;
}

export function classifyRootCause(input: RootCauseInput): RootCauseInvestigation {
  const {
    hoursPendingApproval = 0,
    daysInTransit = 0,
    expectedLeadTimeDays = 7,
    usage7DayAvg = 0,
    usage30DayAvg = 0,
    warehouseStock = 9999,
    requestedQty = 0,
    manualAdjustmentPercent = 0,
  } = input;

  // Rule 1: Approval delay
  if (hoursPendingApproval > 24) {
    return {
      category: 'APPROVAL_DELAY',
      title: 'Approval Delay at District Health Office',
      titleMr: 'जिल्हा आरोग्य कार्यालयात मंजुरी विलंब',
      explanation: `Replenishment request was pending approval for ${hoursPendingApproval} hours (threshold is 24 hours).`,
      explanationMr: `पुनर्भरती विनंती ${hoursPendingApproval} तासांपासून प्रलंबित होती (मर्यादा २४ तास आहे).`,
      ruleTriggered: 'Rule: Request pending > 24 hours without decision.',
      ruleTriggeredMr: 'नियम: २४ तासांपेक्षा जास्त काळ निर्णय प्रलंबित.',
      recommendedAction: 'District Health Office review and approval protocol notification.',
      recommendedActionMr: 'जिल्हा आरोग्य अधिकारी पुनरावलोकन व तातडीची मंजुरी सूचना.',
    };
  }

  // Rule 2: Warehouse shortage
  if (warehouseStock < requestedQty) {
    return {
      category: 'WAREHOUSE_SHORTAGE',
      title: 'Depot Warehouse Shortage',
      titleMr: 'डेपो गोदामात साठा तुटवडा',
      explanation: `Depot warehouse had ${warehouseStock} units, which is below the requested quantity of ${requestedQty} units.`,
      explanationMr: `गोदामात केवळ ${warehouseStock} युनिट्स उपलब्ध आहेत, जे मागविलेल्या ${requestedQty} पेक्षा कमी आहेत.`,
      ruleTriggered: 'Rule: Warehouse stock < requested replenishment quantity.',
      ruleTriggeredMr: 'नियम: गोदामातील साठा आवश्यक प्रमाणापेक्षा कमी.',
      recommendedAction: 'Initiate district central depot bulk procurement order.',
      recommendedActionMr: 'मध्यवर्ती गोदामातून तातडीने अतिरिक्त पुरवठा मागवा.',
    };
  }

  // Rule 3: Supply Delay
  if (daysInTransit > expectedLeadTimeDays) {
    return {
      category: 'SUPPLY_DELAY',
      title: 'Transport / Dispatch Transit Delay',
      titleMr: 'वाहतूक / वितरण विलंब',
      explanation: `Shipment has been in transit for ${daysInTransit} days, exceeding the expected lead time of ${expectedLeadTimeDays} days.`,
      explanationMr: `माल वाहतुकीत ${daysInTransit} दिवस लागले आहेत, जे अपेक्षित ${expectedLeadTimeDays} दिवसांपेक्षा जास्त आहे.`,
      ruleTriggered: 'Rule: Shipment transit duration > expected lead time.',
      ruleTriggeredMr: 'नियम: प्रत्यक्ष वाहतूक वेळ अपेक्षित वेळेपेक्षा जास्त.',
      recommendedAction: 'Verify logistics route and vehicle dispatch tracking status.',
      recommendedActionMr: 'वाहतूक मार्ग आणि वाहन ट्रॅकिंग स्थिती तपासा.',
    };
  }

  // Rule 4: Unexpected Demand Increase
  if (usage30DayAvg > 0 && usage7DayAvg > 1.25 * usage30DayAvg) {
    return {
      category: 'UNEXPECTED_DEMAND',
      title: 'Unexpected Spike in Clinical Demand',
      titleMr: 'क्लिनिकल मागणीत अनपेक्षित वाढ',
      explanation: `Recent 7-day usage (${usage7DayAvg}/day) is >25% higher than historical 30-day usage (${usage30DayAvg}/day).`,
      explanationMr: `मागील ७ दिवसांचा वापर (${usage7DayAvg}/दिवस) हा ३० दिवसांच्या सरासरीपेक्षा (${usage30DayAvg}/दिवस) २५% जास्त आहे.`,
      ruleTriggered: 'Rule: 7-day usage > 1.25 × 30-day baseline average.',
      ruleTriggeredMr: 'नियम: ७ दिवसांचा वापर ३० दिवसांच्या सरासरीपेक्षा २५% जास्त.',
      recommendedAction: 'Review seasonal village disease incidence or local camp demand.',
      recommendedActionMr: 'स्थानिक आजारांचा प्रादुर्भाव किंवा आरोग्य शिबिरांचा आढावा घ्या.',
    };
  }

  // Rule 5: Data Entry Issue
  if (Math.abs(manualAdjustmentPercent) > 30) {
    return {
      category: 'DATA_ENTRY_ISSUE',
      title: 'Possible Physical Count / Data Entry Discrepancy',
      titleMr: 'नोंदणी त्रुटी किंवा प्रत्यक्ष साठ्यात तफावत',
      explanation: `Manual stock adjustment of ${manualAdjustmentPercent}% exceeded the 30% tolerance threshold.`,
      explanationMr: `मॅन्युअल साठा दुरुस्ती ${manualAdjustmentPercent}% झाली आहे, जी ३०% मर्यादेपेक्षा जास्त आहे.`,
      ruleTriggered: 'Rule: Manual stock adjustment > 30% of baseline stock.',
      ruleTriggeredMr: 'नियम: साठा दुरुस्ती ३०% पेक्षा जास्त.',
      recommendedAction: 'Conduct physical inventory audit and verify previous dispense slips.',
      recommendedActionMr: 'प्रत्यक्ष साठा मोजणी आणि वितरण पावत्यांची फेरतपासणी करा.',
    };
  }

  return {
    category: 'NONE_NORMAL',
    title: 'Standard Supply Consumption',
    titleMr: 'नियमित साठा वापर',
    explanation: 'Stock movement and reorder flow followed expected clinical timelines.',
    explanationMr: 'साठा आणि मागणी नियमित कालमर्यादेनुसार सुरू आहे.',
    ruleTriggered: 'Rule: All operational parameters within normal limits.',
    ruleTriggeredMr: 'नियम: सर्व निकष सामान्य मर्यादेत आहेत.',
    recommendedAction: 'Continue standard monitoring protocol.',
    recommendedActionMr: 'नियमित देखरेख सुरू ठेवा.',
  };
}

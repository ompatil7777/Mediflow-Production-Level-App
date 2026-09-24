/**
 * Chronic Status Engine (Rule-based thresholds, no diagnosis wording)
 * As per MEDIFLOW_SPEC.md Section 7.4
 */

export interface BloodPressureInput {
  systolic: number;
  diastolic: number;
}

export interface BloodSugarInput {
  glucose: number;
  readingType: 'fasting' | 'post_meal' | 'random';
}

export interface StatusEvaluation {
  status: 'TARGET' | 'ATTENTION' | 'FOLLOW_UP';
  badgeLabel: string;
  badgeLabelMr: string;
  detail: string;
  detailMr: string;
  statusClass: 'status-available' | 'status-low' | 'status-critical';
}

export function evaluateBloodPressure(input: BloodPressureInput): StatusEvaluation {
  const { systolic, diastolic } = input;

  if (systolic >= 160 || diastolic >= 100) {
    return {
      status: 'FOLLOW_UP',
      badgeLabel: 'Follow-up recommended',
      badgeLabelMr: 'पुनर्तपासणी शिफारस केली',
      detail: 'Recorded reading is elevated beyond typical range. Please consult your PHC medical officer.',
      detailMr: 'नोंदवलेले वाचन नेहमीच्या मर्यादेपेक्षा जास्त आहे. कृपया वैद्यकीय अधिकाऱ्यांचा सल्ला घ्या.',
      statusClass: 'status-critical',
    };
  }

  if (systolic >= 135 || diastolic >= 85) {
    return {
      status: 'ATTENTION',
      badgeLabel: 'Needs attention',
      badgeLabelMr: 'लक्ष देणे आवश्यक',
      detail: 'Slightly elevated. Continue dietary precautions and monitor regularly.',
      detailMr: 'किंचित वाढलेले. आहारात पथ्य पाळा आणि नियमित तपासणी करा.',
      statusClass: 'status-low',
    };
  }

  return {
    status: 'TARGET',
    badgeLabel: 'Within recorded target range',
    badgeLabelMr: 'नोंदवलेल्या मर्यादेत',
    detail: 'Reading is within normal clinical baseline limits.',
    detailMr: 'वाचन सामान्य मर्यादेत आहे.',
    statusClass: 'status-available',
  };
}

export function evaluateBloodSugar(input: BloodSugarInput): StatusEvaluation {
  const { glucose, readingType } = input;

  let upperLimit = 140;
  if (readingType === 'post_meal' || readingType === 'random') {
    upperLimit = 180;
  }

  if (glucose >= upperLimit + 60) {
    return {
      status: 'FOLLOW_UP',
      badgeLabel: 'Follow-up recommended',
      badgeLabelMr: 'पुनर्तपासणी शिफारस केली',
      detail: 'Glucose level is above expected threshold. Follow-up consultation advised.',
      detailMr: 'ग्लुकोज पातळी अपेक्षेपेक्षा जास्त आहे. पाठपुरावा सल्ला आवश्यक.',
      statusClass: 'status-critical',
    };
  }

  if (glucose >= upperLimit) {
    return {
      status: 'ATTENTION',
      badgeLabel: 'Needs attention',
      badgeLabelMr: 'लक्ष देणे आवश्यक',
      detail: 'Reading is moderately high for recorded state.',
      detailMr: 'नोंदवलेल्या वेळेनुसार वाचन किंचित जास्त आहे.',
      statusClass: 'status-low',
    };
  }

  return {
    status: 'TARGET',
    badgeLabel: 'Within recorded target range',
    badgeLabelMr: 'नोंदवलेल्या मर्यादेत',
    detail: 'Reading is within normal baseline parameters.',
    detailMr: 'वाचन सामान्य मर्यादेत आहे.',
    statusClass: 'status-available',
  };
}

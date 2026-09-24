/**
 * Triage Engine (Rule-based decision tree, not AI)
 * As per MEDIFLOW_SPEC.md Section 7.1
 */

import { TriageUrgency } from '../types';

export interface TriageInput {
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  durationDays: number;
  hasRedFlags?: boolean;
}

export interface TriageResult {
  urgency: TriageUrgency;
  title: string;
  titleMr: string;
  recommendation: string;
  recommendationMr: string;
  safetyNotice: string;
  safetyNoticeMr: string;
  matchedRule: string;
  matchedRuleMr: string;
}

export function evaluateTriage(input: TriageInput): TriageResult {
  const { symptoms, severity, durationDays } = input;
  const symptomLower = symptoms.map((s) => s.toLowerCase());

  // Red-flag rules: breathing difficulty OR (chest discomfort + severe)
  const hasBreathingDifficulty = symptomLower.some((s) =>
    s.includes('breathing') || s.includes('breath') || s.includes('श्वास')
  );
  const hasChestDiscomfort = symptomLower.some((s) =>
    s.includes('chest') || s.includes('छाती')
  );

  if (hasBreathingDifficulty || (hasChestDiscomfort && (severity === 'severe' || severity === 'moderate'))) {
    return {
      urgency: 'URGENT',
      title: 'Seek Immediate Medical Attention',
      titleMr: 'तातडीने वैद्यकीय मदत घ्या',
      recommendation: 'Please visit the nearest Primary Health Centre or hospital immediately. Emergency services are outside MediFlow+\'s scope.',
      recommendationMr: 'कृपया तातडीने जवळच्या प्राथमिक आरोग्य केंद्रात किंवा रुग्णालयात जा. आपत्कालीन सेवा MediFlow+ च्या कक्षेबाहेर आहेत.',
      safetyNotice: 'Care-navigation guidance only. Not a medical device.',
      safetyNoticeMr: 'केवळ काळजी-मार्गदर्शन. हे वैद्यकीय उपकरण नाही.',
      matchedRule: 'Red-flag symptom detected (respiratory or acute chest discomfort).',
      matchedRuleMr: 'धोकादायक लक्षण आढळले (श्वसन किंवा छातीत तीव्र अस्वस्थता).',
    };
  }

  // Consultation rule: severe symptoms OR duration > 3 days OR moderate pain
  if (severity === 'severe' || durationDays >= 3 || severity === 'moderate') {
    return {
      urgency: 'CONSULTATION',
      title: 'PHC Medical Officer Consultation Recommended',
      titleMr: 'वैद्यकीय अधिकाऱ्यांचा सल्ला घेणे आवश्यक',
      recommendation: 'Book an appointment at your assigned PHC for a physical clinical examination and advice.',
      recommendationMr: 'तपासणी आणि सल्ल्यासाठी तुमच्या नियुक्त प्राथमिक आरोग्य केंद्रात भेट निश्चित करा.',
      safetyNotice: 'Care-navigation guidance only. Not a medical device.',
      safetyNoticeMr: 'केवळ काळजी-मार्गदर्शन. हे वैद्यकीय उपकरण नाही.',
      matchedRule: `Rule: ${severity} symptoms persistent for ${durationDays} days.`,
      matchedRuleMr: `नियम: ${durationDays} दिवसांपेक्षा जास्त काळ टिकणारी लक्षणे.`,
    };
  }

  // Default: Routine rule
  return {
    urgency: 'ROUTINE',
    title: 'Routine Care & Observation',
    titleMr: 'नियमित काळजी आणि देखरेख',
    recommendation: 'Rest, hydrate, and monitor your symptoms. If symptoms persist beyond 48 hours or worsen, visit your PHC.',
    recommendationMr: 'विश्रांती घ्या, भरपूर पाणी प्या आणि लक्षणांवर लक्ष ठेवा. २ दिवसांपेक्षा जास्त त्रास राहिल्यास केंद्रात या.',
    safetyNotice: 'Care-navigation guidance only. Not a medical device.',
    safetyNoticeMr: 'केवळ काळजी-मार्गदर्शन. हे वैद्यकीय उपकरण नाही.',
    matchedRule: 'Rule: Mild symptom profile without acute physiological indicators.',
    matchedRuleMr: 'नियम: सौम्य लक्षणे, धोकादायक घटक आढळले नाहीत.',
  };
}

import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeft, CheckCircle2, CircleHelp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { evaluateTriage, TriageResult } from '../../engines/triage';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';

type SymptomOption = {
  id: string;
  en: string;
  mr: string;
};

const symptomOptions: SymptomOption[] = [
  { id: 'fever', en: 'Fever', mr: 'ताप' },
  { id: 'cough', en: 'Cough or cold', mr: 'खोकला किंवा सर्दी' },
  { id: 'headache', en: 'Headache', mr: 'डोकेदुखी' },
  { id: 'stomach', en: 'Stomach discomfort', mr: 'पोटात अस्वस्थता' },
  { id: 'breathing difficulty', en: 'Breathing difficulty', mr: 'श्वास घेण्यास त्रास' },
  { id: 'chest discomfort', en: 'Chest discomfort', mr: 'छातीत अस्वस्थता' },
];

const urgencyStyles: Record<TriageResult['urgency'], { panel: string; icon: React.ReactNode }> = {
  ROUTINE: {
    panel: 'border-[#16A34A] bg-[#F0FDF4] text-[#166534]',
    icon: <CheckCircle2 className="w-6 h-6" />,
  },
  CONSULTATION: {
    panel: 'border-[#D97706] bg-[#FFFBEB] text-[#92400E]',
    icon: <CircleHelp className="w-6 h-6" />,
  },
  URGENT: {
    panel: 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B]',
    icon: <AlertTriangle className="w-6 h-6" />,
  },
};

export const SymptomCheck: React.FC = () => {
  const navigate = useNavigate();
  const { getBilingual } = useLanguage();
  const { isOnline } = useSync();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [durationDays, setDurationDays] = useState('1');
  const [result, setResult] = useState<TriageResult | null>(null);
  const [validationError, setValidationError] = useState(false);

  const selectedLabel = useMemo(
    () =>
      symptomOptions
        .filter((option) => selectedSymptoms.includes(option.id))
        .map((option) => option.en),
    [selectedSymptoms],
  );

  const toggleSymptom = (id: string) => {
    setValidationError(false);
    setSelectedSymptoms((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const runCheck = () => {
    if (selectedSymptoms.length === 0) {
      setValidationError(true);
      setResult(null);
      return;
    }

    setValidationError(false);
    setResult(
      evaluateTriage({
        symptoms: selectedLabel,
        severity,
        durationDays: Math.max(1, Number(durationDays) || 1),
      }),
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate('/patient/home')}
          aria-label="Back to Patient Home"
          className="min-h-[48px] min-w-[48px] rounded-[6px] border border-surface-border bg-white text-brand flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <BilingualText
          en="Check Symptoms"
          mr="लक्षणे तपासा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
      </div>

      <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
        <p className="text-sm font-semibold text-content-primary">
          {getBilingual(
            'This is care-navigation guidance, not a diagnosis.',
            'हे निदान नसून केवळ काळजी-मार्गदर्शन आहे.',
          ).primary}
        </p>
        <p className="text-xs text-content-secondary mt-1">
          {isOnline
            ? getBilingual('The rule-based check works on this device.', 'नियम-आधारित तपासणी या डिव्हाइसवर चालते.').primary
            : getBilingual('You can use this saved check while offline.', 'ऑफलाइन असतानाही ही तपासणी वापरता येते.').primary}
        </p>
      </div>

      <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
        <h2 className="text-base font-bold text-content-primary">
          {getBilingual('What are you feeling?', 'तुम्हाला काय त्रास होत आहे?').primary}
        </h2>
        <p className="text-sm text-content-secondary mt-0.5">
          {getBilingual('Select all that apply.', 'लागू असलेली सर्व लक्षणे निवडा.').primary}
        </p>
        <div className="grid grid-cols-1 gap-2 mt-3">
          {symptomOptions.map((option) => {
            const isSelected = selectedSymptoms.includes(option.id);
            return (
              <label
                key={option.id}
                className={`min-h-[48px] px-3 rounded-[6px] border flex items-center gap-3 cursor-pointer ${
                  isSelected ? 'border-brand bg-brand/10' : 'border-surface-border bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSymptom(option.id)}
                  className="w-5 h-5 accent-brand"
                />
                <span className="flex flex-col">
                  <span className="text-sm font-semibold text-content-primary">
                    {getBilingual(option.en, option.mr).primary}
                  </span>
                  <span className="text-xs text-content-secondary">
                    {getBilingual(option.en, option.mr).secondary}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
        <h2 className="text-base font-bold text-content-primary">
          {getBilingual('How severe is it?', 'त्रास किती आहे?').primary}
        </h2>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {(['mild', 'moderate', 'severe'] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setSeverity(level)}
              className={`min-h-[48px] rounded-[6px] border-2 text-sm font-semibold ${
                severity === level
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual(
                level.charAt(0).toUpperCase() + level.slice(1),
                level === 'mild' ? 'सौम्य' : level === 'moderate' ? 'मध्यम' : 'तीव्र',
              ).primary}
            </button>
          ))}
        </div>

        <label className="flex flex-col gap-1.5 mt-4">
          <span className="text-sm font-semibold text-content-primary">
            {getBilingual('How many days?', 'किती दिवसांपासून?').primary}
          </span>
          <input
            type="number"
            min="1"
            max="30"
            value={durationDays}
            onChange={(event) => setDurationDays(event.target.value)}
            className="h-[52px] px-3 rounded-[6px] border-2 border-surface-border text-base text-content-primary focus:border-brand focus:outline-none"
          />
        </label>
      </section>

      {validationError && (
        <p className="p-3 rounded-[6px] border-2 border-[#DC2626] bg-[#FEF2F2] text-sm text-[#991B1B]">
          {getBilingual('Select at least one symptom to continue.', 'पुढे जाण्यासाठी किमान एक लक्षण निवडा.').primary}
        </p>
      )}

      <Button
        enText="Check Symptoms"
        mrText="लक्षणे तपासा"
        onClick={runCheck}
      />

      {result && (
        <section className={`p-4 rounded-[6px] border-2 ${urgencyStyles[result.urgency].panel}`}>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{urgencyStyles[result.urgency].icon}</div>
            <div>
              <p className="text-xs font-bold tracking-wide">{result.urgency}</p>
              <h2 className="text-base font-bold mt-1">{getBilingual(result.title, result.titleMr).primary}</h2>
              <p className="text-sm mt-0.5">{getBilingual(result.title, result.titleMr).secondary}</p>
            </div>
          </div>
          <p className="text-sm mt-3">{getBilingual(result.recommendation, result.recommendationMr).primary}</p>
          <p className="text-xs mt-1">{getBilingual(result.safetyNotice, result.safetyNoticeMr).primary}</p>
          <div className="mt-3 pt-3 border-t border-current/20">
            <p className="text-xs font-semibold">{getBilingual('Why this result?', 'हा निकाल का?').primary}</p>
            <p className="text-xs mt-1">{getBilingual(result.matchedRule, result.matchedRuleMr).primary}</p>
          </div>
        </section>
      )}

      <Button
        variant="secondary"
        enText="Back to Patient Home"
        mrText="रुग्ण मुख्यपृष्ठावर परत"
        onClick={() => navigate('/patient/home')}
      />
    </div>
  );
};
import React, { useEffect, useMemo, useState } from 'react';
import { Activity, CheckCircle2, ClipboardList, HeartPulse } from 'lucide-react';
import { readingsService } from '../../services/readings';
import { HealthReading, Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { Modal } from '../../components/common/Modal';

type ReadingType = 'bp' | 'sugar';

const bpStatusLabel = (sys: number, dia: number): { en: string; mr: string } => {
  if (sys >= 140 || dia >= 90) return { en: 'Needs attention', mr: 'लक्ष देणे आवश्यक' };
  return { en: 'Within recorded target range', mr: 'नोंदवलेल्या मर्यादेत' };
};

const sugarStatusLabel = (glucose: number, readingType: string): { en: string; mr: string } => {
  const limits: Record<string, number> = { fasting: 126, post_meal: 180, random: 200 };
  const limit = limits[readingType] || 140;
  if (glucose > limit) return { en: 'Needs attention', mr: 'लक्ष देणे आवश्यक' };
  return { en: 'Within recorded target range', mr: 'नोंदवलेल्या मर्यादेत' };
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export const HealthWorkerRecordReading: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const { isOnline } = useSync();
  const phcId = user.phcId || 'phc-shivapur';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [recentReadings, setRecentReadings] = useState<HealthReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [readingType, setReadingType] = useState<ReadingType>('bp');
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [glucose, setGlucose] = useState('');
  const [sugarReadingType, setSugarReadingType] = useState<'fasting' | 'post_meal' | 'random'>('fasting');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [confirmation, setConfirmation] = useState<HealthReading | null>(null);

  const loadPage = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const pats = readingsService.getPatients(phcId);
      setPatients(pats);
      setSelectedPatientId((cur) => (cur && pats.some((p) => p.id === cur) ? cur : pats[0]?.id || ''));
      setRecentReadings(readingsService.getReadings());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [phcId]);

  const selectedPatient = useMemo(
    () => patients.find((p) => p.id === selectedPatientId),
    [patients, selectedPatientId],
  );

  const readingsForPatient = useMemo(
    () => recentReadings.filter((r) => r.patientId === selectedPatientId),
    [recentReadings, selectedPatientId],
  );

  const isFormValid = useMemo(() => {
    if (!selectedPatientId) return false;
    if (readingType === 'bp') {
      const s = Number(systolic);
      const d = Number(diastolic);
      return s > 0 && s < 300 && d > 0 && d < 200;
    }
    const g = Number(glucose);
    return g > 0 && g < 1000;
  }, [selectedPatientId, readingType, systolic, diastolic, glucose]);

  const handleSave = () => {
    if (!isFormValid || !selectedPatient) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      let label: { en: string; mr: string };
      let partial: Omit<HealthReading, 'id' | 'recordedAt'>;

      if (readingType === 'bp') {
        const sys = Number(systolic);
        const dia = Number(diastolic);
        label = bpStatusLabel(sys, dia);
        partial = {
          patientId: selectedPatient.id,
          type: 'bp',
          systolic: sys,
          diastolic: dia,
          statusLabel: label.en,
          statusLabelMr: label.mr,
          recordedBy: user.fullName,
          recordedRole: 'health_worker',
        };
      } else {
        const g = Number(glucose);
        label = sugarStatusLabel(g, sugarReadingType);
        partial = {
          patientId: selectedPatient.id,
          type: 'sugar',
          glucose: g,
          readingType: sugarReadingType,
          statusLabel: label.en,
          statusLabelMr: label.mr,
          recordedBy: user.fullName,
          recordedRole: 'health_worker',
        };
      }

      const created = readingsService.record_reading(partial);
      setConfirmation(created);
      setRecentReadings(readingsService.getReadings());
      setSystolic('');
      setDiastolic('');
      setGlucose('');
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSystolic('');
    setDiastolic('');
    setGlucose('');
    setConfirmation(null);
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Record a Reading"
          mr="तपासणी नोंदवा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Record BP or blood sugar for an assigned patient', 'नियुक्त रुग्णासाठी रक्तदाब किंवा साखर नोंदवा').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={4} />}
      {!isLoading && hasError && <ErrorState onRetry={loadPage} />}

      {!isLoading && !hasError && patients.length === 0 && (
        <EmptyState
          titleEn="No assigned patients"
          titleMr="नियुक्त रुग्ण नाहीत"
          descEn="Patients assigned to your PHC will appear here for reading entry."
          descMr="तुमच्या केंद्राचे रुग्ण तपासणी नोंदवण्यासाठी येथे दिसतील."
          icon={ClipboardList}
        />
      )}

      {!isLoading && !hasError && patients.length > 0 && (
        <>
          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <label className="mb-1.5 block">
              <span className="text-base font-bold text-content-primary">
                {getBilingual('Select patient', 'रुग्ण निवडा').primary}
              </span>
            </label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.id})
                </option>
              ))}
            </select>
            {selectedPatient && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedPatient.chronicConditions.map((cond, i) => (
                  <span
                    key={cond}
                    className="text-xs font-semibold px-2 py-1 rounded-[4px] bg-[#EFF6FF] border border-[#2563EB] text-[#2563EB]"
                  >
                    {getBilingual(cond, selectedPatient.chronicConditionsMr[i]).primary}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <BilingualText
              en="Reading type"
              mr="तपासणीचा प्रकार"
              primaryClassName="text-sm font-bold text-content-primary"
              secondaryClassName="text-xs text-content-secondary"
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                type="button"
                onClick={() => setReadingType('bp')}
                className={`min-h-[52px] rounded-[6px] border-2 px-3 flex items-center justify-center gap-2 text-sm font-semibold ${
                  readingType === 'bp'
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-surface-border bg-white text-content-primary'
                }`}
              >
                <HeartPulse className="w-4 h-4" />
                {getBilingual('Blood pressure', 'रक्तदाब').primary}
              </button>
              <button
                type="button"
                onClick={() => setReadingType('sugar')}
                className={`min-h-[52px] rounded-[6px] border-2 px-3 flex items-center justify-center gap-2 text-sm font-semibold ${
                  readingType === 'sugar'
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-surface-border bg-white text-content-primary'
                }`}
              >
                <Activity className="w-4 h-4" />
                {getBilingual('Blood sugar', 'रक्तातील साखर').primary}
              </button>
            </div>
          </section>

          {readingType === 'bp' ? (
            <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <BilingualText
                en="Blood pressure values"
                mr="रक्तदाब मूल्ये"
                primaryClassName="text-sm font-bold text-content-primary"
                secondaryClassName="text-xs text-content-secondary"
              />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-content-secondary mb-1">
                    {getBilingual('Systolic (mmHg)', 'सिस्टोलिक (मि.मी.एच.जी.)').primary}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={systolic}
                    onChange={(e) => setSystolic(e.target.value)}
                    placeholder="120"
                    className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-content-secondary mb-1">
                    {getBilingual('Diastolic (mmHg)', 'डायस्टोलिक (मि.मी.एच.जी.)').primary}
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={diastolic}
                    onChange={(e) => setDiastolic(e.target.value)}
                    placeholder="80"
                    className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
                  />
                </div>
              </div>
            </section>
          ) : (
            <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <BilingualText
                en="Blood sugar values"
                mr="साखर मूल्ये"
                primaryClassName="text-sm font-bold text-content-primary"
                secondaryClassName="text-xs text-content-secondary"
              />
              <div className="mt-3">
                <label className="text-xs font-semibold text-content-secondary mb-1 block">
                  {getBilingual('Reading type', 'तपासणीचा प्रकार').primary}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { val: 'fasting', en: 'Fasting', mr: 'उपास' },
                    { val: 'post_meal', en: 'Post-meal', mr: 'जेवणानंतर' },
                    { val: 'random', en: 'Random', mr: 'यादृच्छिक' },
                  ] as const).map((opt) => (
                    <button
                      type="button"
                      key={opt.val}
                      onClick={() => setSugarReadingType(opt.val)}
                      className={`min-h-[44px] rounded-[6px] border-2 px-2 text-xs font-semibold ${
                        sugarReadingType === opt.val
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-surface-border bg-white text-content-primary'
                      }`}
                    >
                      {getBilingual(opt.en, opt.mr).primary}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs font-semibold text-content-secondary mb-1 block">
                  {getBilingual('Glucose (mg/dL)', 'ग्लुकोज (मि.ग्रॅ./डी.एल.)').primary}
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={glucose}
                  onChange={(e) => setGlucose(e.target.value)}
                  placeholder="110"
                  className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
                />
              </div>
            </section>
          )}

          {saveError && (
            <div className="p-3 bg-[#FEF2F2] border border-[#DC2626] rounded-[6px]">
              <p className="text-sm font-semibold text-[#DC2626]">
                {getBilingual('Could not save reading. Please try again.', 'तपासणी जतन करता आली नाही. कृपया पुन्हा प्रयत्न करा.').primary}
              </p>
            </div>
          )}

          <Button
            enText={isSaving ? 'Saving…' : 'Save Reading'}
            mrText={isSaving ? 'जतन होत आहे…' : 'तपासणी जतन करा'}
            onClick={handleSave}
            disabled={!isFormValid || isSaving || !isOnline}
          />

          <p className="text-xs text-content-muted">
            {getBilingual(
              'Recorded readings are for care-navigation only and are not a diagnosis.',
              'नोंदवलेल्या तपासण्या केवळ काळजी-मार्गदर्शनासाठी आहेत; हे निदान नाही.',
            ).primary}
          </p>

          {readingsForPatient.length > 0 && (
            <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <BilingualText
                en="Recent readings for this patient"
                mr="या रुग्णाच्या ताज्या तपासण्या"
                primaryClassName="text-sm font-bold text-content-primary"
                secondaryClassName="text-xs text-content-secondary"
              />
              <div className="flex flex-col divide-y divide-surface-border mt-2">
                {readingsForPatient.slice(0, 6).map((r) => (
                  <div key={r.id} className="py-2.5 first:pt-1.5 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-content-primary">
                        {r.type === 'bp'
                          ? getBilingual('Blood pressure', 'रक्तदाब').primary
                          : getBilingual('Blood sugar', 'रक्तातील साखर').primary}
                      </p>
                      <span className="text-xs text-content-muted whitespace-nowrap">{formatDate(r.recordedAt)}</span>
                    </div>
                    <p className="text-xs text-content-secondary mt-0.5">
                      {r.type === 'bp'
                        ? `${r.systolic}/${r.diastolic} mmHg`
                        : `${r.glucose} mg/dL (${r.readingType || 'reading'})`}
                    </p>
                    <p className="text-xs text-content-muted mt-0.5">
                      {getBilingual('Recorded by ', 'नोंद करणारे: ').primary}{r.recordedBy}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Modal
        isOpen={!!confirmation}
        onClose={resetForm}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            <BilingualText
              en="Reading Saved"
              mr="तपासणी जतन झाली"
              primaryClassName="text-lg font-bold text-content-primary"
              secondaryClassName="text-sm text-content-secondary"
            />
          </div>
        }
      >
        {confirmation && (
          <div className="flex flex-col gap-3">
            <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded-[6px]">
              <p className="text-sm font-bold text-[#166534]">
                {confirmation.type === 'bp'
                  ? getBilingual('Blood pressure', 'रक्तदाब').primary
                  : getBilingual('Blood sugar', 'रक्तातील साखर').primary}
              </p>
              <p className="text-base font-bold text-content-primary mt-1">
                {confirmation.type === 'bp'
                  ? `${confirmation.systolic}/${confirmation.diastolic} mmHg`
                  : `${confirmation.glucose} mg/dL (${confirmation.readingType || 'reading'})`}
              </p>
              <p className="text-xs text-content-secondary mt-1">
                {getBilingual(confirmation.statusLabel, confirmation.statusLabelMr).primary}
              </p>
            </div>
            <p className="text-sm text-content-secondary">
              {getBilingual(
                'The reading has been saved to the patient record.',
                'तपासणी रुग्ण नोंदीत जतन केली आहे.',
              ).primary}
            </p>
            <Button enText="Record Another" mrText="आणखी नोंदवा" onClick={resetForm} />
          </div>
        )}
      </Modal>
    </div>
  );
};

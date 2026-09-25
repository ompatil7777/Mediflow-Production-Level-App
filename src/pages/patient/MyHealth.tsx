import React, { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowLeft, HeartPulse, Plus, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { readingsService } from '../../services/readings';
import { HealthReading } from '../../types';
import { MOCK_PATIENTS } from '../../data/mockData';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PatientOfflineNotice } from '../../components/patient/PatientOfflineNotice';

const patient = MOCK_PATIENTS[0];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export const MyHealth: React.FC = () => {
  const navigate = useNavigate();
  const { getBilingual } = useLanguage();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadReadings = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setReadings(readingsService.getReadings(patient.id));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReadings();
  }, []);

  const latestReadings = useMemo(() => {
    const latestBp = readings.find((reading) => reading.type === 'bp');
    const latestSugar = readings.find((reading) => reading.type === 'sugar');
    return { latestBp, latestSugar };
  }, [readings]);

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
          en="My Health Record"
          mr="माझी आरोग्य नोंद"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
      </div>

      <PatientOfflineNotice />

      <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
            <UserRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-content-primary">
              {getBilingual(patient.fullName, patient.fullNameMr).primary}
            </h2>
            <p className="text-sm text-content-secondary">
              {patient.id} · {getBilingual(patient.villageName, patient.villageNameMr).primary}
            </p>
            <p className="text-sm text-content-secondary mt-1">
              {getBilingual('Care at ', 'नियुक्त केंद्र: ').primary}
              {getBilingual(patient.assignedPhcName, patient.assignedPhcNameMr).primary}
            </p>
          </div>
        </div>
      </section>

      {isLoading && <LoadingSkeleton rows={4} />}

      {!isLoading && hasError && <ErrorState onRetry={loadReadings} />}

      {!isLoading && !hasError && readings.length === 0 && (
        <EmptyState
          titleEn="No health readings yet"
          titleMr="आरोग्य तपासणीच्या नोंदी नाहीत"
          descEn="Your recorded blood pressure and sugar readings will appear here."
          descMr="तुमच्या रक्तदाब आणि साखरेच्या नोंदी येथे दिसतील."
          icon={HeartPulse}
        />
      )}

      {!isLoading && !hasError && readings.length > 0 && (
        <>
          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Latest readings"
                mr="ताज्या तपासण्या"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <Activity className="w-5 h-5 text-brand" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                <p className="text-sm text-content-secondary">
                  {getBilingual('Blood pressure', 'रक्तदाब').primary}
                </p>
                <p className="text-xl font-bold text-content-primary mt-1">
                  {latestReadings.latestBp?.systolic ?? '—'}/{latestReadings.latestBp?.diastolic ?? '—'}
                </p>
                <p className="text-xs text-content-muted mt-1">mmHg</p>
                {latestReadings.latestBp && (
                  <p className="text-xs font-semibold text-status-available mt-2">
                    {getBilingual(latestReadings.latestBp.statusLabel, latestReadings.latestBp.statusLabelMr).primary}
                  </p>
                )}
              </div>
              <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                <p className="text-sm text-content-secondary">
                  {getBilingual('Blood sugar', 'रक्तातील साखर').primary}
                </p>
                <p className="text-xl font-bold text-content-primary mt-1">
                  {latestReadings.latestSugar?.glucose ?? '—'}
                </p>
                <p className="text-xs text-content-muted mt-1">mg/dL</p>
                {latestReadings.latestSugar && (
                  <p className="text-xs font-semibold text-status-available mt-2">
                    {getBilingual(latestReadings.latestSugar.statusLabel, latestReadings.latestSugar.statusLabelMr).primary}
                  </p>
                )}
              </div>
            </div>
            <p className="text-xs text-content-muted mt-3">
              {getBilingual(
                'Recorded readings only; this is not a diagnosis.',
                'फक्त नोंदवलेल्या तपासण्या; हे निदान नाही.',
              ).primary}
            </p>
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <BilingualText
              en="Reading history"
              mr="तपासणी इतिहास"
              primaryClassName="text-base font-bold text-content-primary"
              secondaryClassName="text-sm text-content-secondary"
            />
            <div className="flex flex-col divide-y divide-surface-border mt-2">
              {readings.map((reading) => (
                <div key={reading.id} className="py-3 first:pt-2 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-content-primary">
                        {reading.type === 'bp'
                          ? getBilingual('Blood pressure', 'रक्तदाब').primary
                          : getBilingual('Blood sugar', 'रक्तातील साखर').primary}
                      </p>
                      <p className="text-sm text-content-secondary mt-0.5">
                        {reading.type === 'bp'
                          ? `${reading.systolic}/${reading.diastolic} mmHg`
                          : `${reading.glucose} mg/dL (${reading.readingType || 'reading'})`}
                      </p>
                    </div>
                    <span className="text-xs text-content-muted whitespace-nowrap">{formatDate(reading.recordedAt)}</span>
                  </div>
                  <p className="text-xs text-content-muted mt-1">
                    {getBilingual('Recorded by ', 'नोंद करणारे: ').primary}{reading.recordedBy}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <Button
        variant="secondary"
        enText="Back to Patient Home"
        mrText="रुग्ण मुख्यपृष्ठावर परत"
        onClick={() => navigate('/patient/home')}
        icon={<Plus className="w-4 h-4 rotate-45" />}
      />
    </div>
  );
};
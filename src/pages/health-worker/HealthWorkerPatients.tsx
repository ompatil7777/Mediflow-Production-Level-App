import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, HeartPulse, Search, Users, X } from 'lucide-react';
import { readingsService } from '../../services/readings';
import { HealthReading, Patient } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

export const HealthWorkerPatients: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';

  const [patients, setPatients] = useState<Patient[]>([]);
  const [allReadings, setAllReadings] = useState<HealthReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadPatients = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setPatients(readingsService.getPatients(phcId));
      setAllReadings(readingsService.getReadings());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [phcId]);

  const readingsByPatient = useMemo(() => {
    const map: Record<string, HealthReading[]> = {};
    for (const r of allReadings) {
      if (!map[r.patientId]) map[r.patientId] = [];
      map[r.patientId].push(r);
    }
    return map;
  }, [allReadings]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.fullNameMr.includes(search.trim()) ||
        p.id.toLowerCase().includes(q) ||
        p.villageName.toLowerCase().includes(q) ||
        p.villageNameMr.includes(search.trim()),
    );
  }, [patients, search]);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Patients"
          mr="रुग्ण"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Assigned patients at your PHC', 'तुमच्या केंद्राचे नियुक्त रुग्ण').primary}
        </p>
      </div>

      <OfflineNotice />

      <div className="relative">
        <Search className="w-5 h-5 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={getBilingual('Search by name, ID, or village', 'नाव, आयडी, किंवा गाव शोधा').primary}
          className="h-[52px] w-full pl-10 pr-10 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadPatients} />}

      {!isLoading && !hasError && filtered.length === 0 && (
        <EmptyState
          titleEn={search ? 'No patients match your search' : 'No assigned patients'}
          titleMr={search ? 'शोधाशी जुळणारे रुग्ण नाहीत' : 'नियुक्त रुग्ण नाहीत'}
          descEn={search ? 'Try a different name or village.' : 'Patients assigned to your PHC will appear here.'}
          descMr={search ? 'वेगळे नाव किंवा गाव वापरून पहा.' : 'तुमच्या केंद्राचे रुग्ण येथे दिसतील.'}
          icon={Users}
        />
      )}

      {!isLoading && !hasError && filtered.length > 0 && (
        <div className="flex flex-col gap-2">
          {filtered.map((patient) => {
            const readings = readingsByPatient[patient.id] || [];
            const latestBp = readings.find((r) => r.type === 'bp');
            const latestSugar = readings.find((r) => r.type === 'sugar');
            const isOpen = expandedId === patient.id;

            return (
              <div key={patient.id} className="bg-white border-[1.5px] border-surface-border rounded-[6px] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : patient.id)}
                  className="w-full p-4 flex items-start justify-between gap-3 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      {patient.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(patient.fullName, patient.fullNameMr).primary}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {patient.id} · {patient.age} {getBilingual('yrs', 'वर्षे').primary} · {getBilingual(patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other', patient.genderMr).primary}
                      </p>
                      <p className="text-xs text-content-muted mt-0.5">
                        {getBilingual(patient.villageName, patient.villageNameMr).primary}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-content-muted flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-surface-border">
                    {patient.chronicConditions.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
                          {getBilingual('Chronic conditions', 'जुनाट आजार').primary}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {patient.chronicConditions.map((cond, i) => (
                            <span
                              key={cond}
                              className="text-xs font-semibold px-2 py-1 rounded-[4px] bg-[#EFF6FF] border border-[#2563EB] text-[#2563EB]"
                            >
                              {getBilingual(cond, patient.chronicConditionsMr[i]).primary}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
                        {getBilingual('Latest readings', 'ताज्या तपासण्या').primary}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mt-1.5">
                        <div className="p-2.5 bg-surface-well border border-surface-border rounded-[6px]">
                          <p className="text-xs text-content-secondary">{getBilingual('BP', 'रक्तदाब').primary}</p>
                          <p className="text-base font-bold text-content-primary">
                            {latestBp ? `${latestBp.systolic}/${latestBp.diastolic}` : '—'}
                          </p>
                          {latestBp && (
                            <p className="text-xs text-content-muted mt-0.5">
                              {getBilingual(latestBp.statusLabel, latestBp.statusLabelMr).primary}
                            </p>
                          )}
                        </div>
                        <div className="p-2.5 bg-surface-well border border-surface-border rounded-[6px]">
                          <p className="text-xs text-content-secondary">{getBilingual('Sugar', 'साखर').primary}</p>
                          <p className="text-base font-bold text-content-primary">
                            {latestSugar ? `${latestSugar.glucose} mg/dL` : '—'}
                          </p>
                          {latestSugar && (
                            <p className="text-xs text-content-muted mt-0.5">
                              {getBilingual(latestSugar.statusLabel, latestSugar.statusLabelMr).primary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {readings.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
                          {getBilingual('Reading history', 'तपासणी इतिहास').primary}
                        </p>
                        <div className="flex flex-col divide-y divide-surface-border mt-1.5">
                          {readings.map((r) => (
                            <div key={r.id} className="py-2 first:pt-1.5 last:pb-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold text-content-primary">
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
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {readings.length === 0 && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-content-muted">
                        <HeartPulse className="w-4 h-4 flex-shrink-0" />
                        <span>{getBilingual('No readings recorded yet', 'अद्याप तपासणी नोंदवलेली नाही').primary}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { appointmentsService } from '../../services/appointments';
import { readingsService } from '../../services/readings';
import { Appointment, HealthReading, PHC } from '../../types';
import { MOCK_PHCS, INITIAL_INVENTORY } from '../../data/mockData';

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const lang = (en: string, mr: string) => language === 'mr' ? mr : en;

  const patientId = user.patientId || 'MF-P-0001';
  const phcId = user.phcId || 'phc-shivapur';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [phc, setPhc] = useState<PHC | undefined>();
  const [readings, setReadings] = useState<HealthReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apts, phcData, rds] = await Promise.all([
          appointmentsService.getAppointments(undefined, patientId),
          appointmentsService.getPhc(phcId),
          readingsService.getReadings(patientId),
        ]);
        setAppointments(apts);
        setPhc(phcData);
        setReadings(rds);
      } catch {
        // fallback to mock data for offline display
        setPhc(MOCK_PHCS.find(p => p.id === phcId));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [patientId, phcId]);

  const latestAppointment = appointments
    .filter(a => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];

  const latestBp = readings.find(r => r.type === 'bp');
  const latestSugar = readings.find(r => r.type === 'sugar');

  const phcName = phc?.name || user.phcName || 'PHC Shivapur';
  const phcNameMr = phc?.nameMr || 'प्रा. आ. केंद्र शिवापूर';
  const metformin = INITIAL_INVENTORY.find(item => item.medicineId === 'med-2');

  return (
    <div className="flex flex-col gap-3 pb-4">

      {/* Greeting & Patient Identifier */}
      <section className="bg-white border-l-4 border-brand p-3 rounded border border-surface-border">
        <div className="flex items-start justify-between">
          <div>
            {language === 'mr' ? (
              <>
                <h1 className="text-[18px] font-bold text-content-primary">{user.fullNameMr}</h1>
                <p className="text-sm text-content-secondary">{user.fullName}</p>
              </>
            ) : (
              <>
                <h1 className="text-[18px] font-bold text-content-primary">{user.fullName}</h1>
                <p className="text-sm text-content-secondary">{user.fullNameMr}</p>
              </>
            )}
          </div>
          <span className="inline-flex items-center px-2 py-1 bg-surface-well text-brand text-xs font-bold rounded border border-surface-border">
            {patientId}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-surface-border flex items-center gap-1.5 text-content-secondary text-sm">
          <span className="material-symbols-outlined text-brand text-[16px]">location_on</span>
          <span>{lang('Your PHC', 'तुमचे केंद्र')}: {lang(phcName, phcNameMr)}</span>
        </div>
      </section>

      {/* CARD 1: My PHC */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs text-brand font-semibold uppercase tracking-wide">PHC Center</span>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My PHC', 'माझे प्रा.आ.केंद्र')}
            </h2>
            <p className="text-[15px] font-semibold text-content-primary">
              {lang(phcName, phcNameMr)}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-status-available-bg border border-green-200 px-2.5 py-1 rounded text-status-available min-h-[32px]">
            <span className="w-2 h-2 rounded-full bg-status-available animate-ping"></span>
            <span className="text-xs font-semibold">{lang('Consulting Now', 'तपासणी सुरू')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => navigate('/patient/book-appointment')}
            className="min-h-[48px] px-2 bg-white border-2 border-brand text-brand text-sm font-semibold rounded flex items-center justify-center gap-1.5 active:bg-surface-well"
          >
            <span className="material-symbols-outlined text-[18px]">event</span>
            <span>{lang('Book Appointment', 'भेट निश्चित करा')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/patient/nearby-phcs')}
            className="min-h-[48px] px-2 bg-surface-well border border-surface-border text-brand text-sm font-semibold rounded flex items-center justify-center gap-1.5 active:bg-surface-ground"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            <span>{lang('Directions', 'दिशा')}</span>
          </button>
        </div>
      </section>

      {/* CARD 2: My Appointments */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My Appointments', 'माझ्या भेटी')}
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-content-muted">{lang('Loading appointments...', 'भेटी लोड होत आहेत...')}</p>
        ) : appointments.length === 0 ? (
          <p className="text-sm text-content-secondary">
            {lang('No appointments booked yet.', 'अद्याप भेटीची नोंद नाही.')}
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-surface-border">
            {appointments
              .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
              .slice(0, 3)
              .map((apt) => (
                <div key={apt.id} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-content-primary">
                      {apt.date} · {apt.time}
                    </p>
                    <p className="text-xs text-content-secondary mt-0.5">
                      {lang(apt.careType, apt.careTypeMr)}
                    </p>
                    <p className="text-xs text-content-muted mt-0.5">
                      {lang(apt.phcName, apt.phcNameMr)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-1 rounded border border-[#D97706] bg-[#FFFBEB] text-[#D97706]">
                      {lang('Booked', 'बुकिंग')}
                    </span>
                    <span className="bg-brand text-white px-2 py-1 rounded text-xs font-bold">
                      #{apt.tokenNo}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate('/patient/book-appointment')}
          className="w-full mt-3 min-h-[44px] bg-brand text-white text-sm font-semibold rounded flex items-center justify-center gap-1.5 active:opacity-90"
        >
          <span>{lang('Book New Appointment →', 'नवीन भेट निश्चित करा →')}</span>
        </button>
      </section>

      {/* CARD 3: Check Symptoms */}
      <section className="bg-white border-2 border-brand rounded p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded bg-surface-well flex items-center justify-center flex-shrink-0 text-brand">
            <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('Check Symptoms', 'लक्षणे तपासा')}
            </h2>
            <p className="text-sm text-content-secondary mt-0.5">
              {lang('Feeling unwell? Check symptoms for PHC care guidance.', 'बरे वाटत नाही का? प्राथमिक तपासणी करा.')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/symptom-check')}
          className="w-full min-h-[52px] bg-brand text-white text-base font-semibold rounded flex items-center justify-center gap-2 active:opacity-90"
        >
          <span>{lang('Start Symptom Check →', 'लक्षणे नोंदवा →')}</span>
        </button>
      </section>

      {/* CARD 4: Medicine Stock */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs text-content-muted uppercase tracking-wider font-semibold">Pharmacy Alert</span>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('Medicine Stock', 'औषध साठा')}
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-status-low-bg border border-yellow-200 text-status-low px-2.5 py-1 rounded min-h-[32px]">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            <span className="text-xs font-bold">{lang('LOW STOCK', 'कमी साठा')}</span>
          </div>
        </div>
        <div
          onClick={() => navigate('/patient/medicines')}
          className="bg-surface-well p-3 rounded border border-surface-border flex items-center justify-between cursor-pointer hover:bg-surface-ground"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white border border-surface-border flex items-center justify-center text-brand">
              <span className="material-symbols-outlined text-[22px]">medication</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-content-primary">Metformin 500mg</h3>
              <p className="text-xs text-content-muted">{lang('Daily chronic dose', 'रोजची मात्रा')}</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-[17px] font-bold text-status-low">{metformin?.currentStock ?? 0} units</span>
             <p className="text-xs text-content-muted">{phcName}</p>
          </div>
        </div>
      </section>

      {/* CARD 5: My Health */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My Health', 'माझे आरोग्य')}
            </h2>
            <p className="text-xs text-content-muted">{lang('Latest recorded vitals', 'ताजी तपासणी')}</p>
          </div>
          <span className="material-symbols-outlined text-brand text-[24px]">favorite</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 bg-surface-well rounded border border-surface-border">
            <span className="text-xs text-content-muted block">{lang('Blood Pressure', 'रक्तदाब')}</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-[17px] font-bold text-content-primary">
                {latestBp ? `${latestBp.systolic}/${latestBp.diastolic}` : '—'}
              </span>
              <span className="text-xs text-content-muted">mmHg</span>
            </div>
            {latestBp && (
              <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded">
                {lang(latestBp.statusLabel, latestBp.statusLabelMr)}
              </span>
            )}
          </div>
          <div className="p-2 bg-surface-well rounded border border-surface-border">
            <span className="text-xs text-content-muted block">{lang('Fasting Sugar', 'साखर')}</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-[17px] font-bold text-content-primary">
                {latestSugar ? latestSugar.glucose : '—'}
              </span>
              <span className="text-xs text-content-muted">mg/dL</span>
            </div>
            {latestSugar && (
              <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded">
                {lang(latestSugar.statusLabel, latestSugar.statusLabelMr)}
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/my-health')}
          className="w-full mt-3 min-h-[44px] bg-surface-well border border-surface-border text-brand text-sm font-semibold rounded flex items-center justify-center gap-1.5 hover:bg-brand/5 active:bg-brand/10"
        >
          <span>{lang('View Full Health Record →', 'संपूर्ण आरोग्य नोंद →')}</span>
        </button>
      </section>
    </div>
  );
};

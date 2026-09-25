import React, { useEffect, useState } from 'react';
import { Activity, CalendarDays, ClipboardList, HeartPulse, Users } from 'lucide-react';
import { appointmentsService } from '../../services/appointments';
import { readingsService } from '../../services/readings';
import { Appointment, HealthReading, Patient, PHC } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

interface DashboardData {
  phc: PHC;
  patients: Patient[];
  appointments: Appointment[];
  readings: HealthReading[];
}

export const HealthWorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadDashboard = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const phc = appointmentsService.getPhc(phcId);
      if (!phc) throw new Error('PHC not found');

      const patients = readingsService.getPatients(phcId);
      const patientIds = new Set(patients.map((patient) => patient.id));
      const readings = readingsService.getReadings().filter((reading) => patientIds.has(reading.patientId));

      setData({
        phc,
        patients,
        appointments: appointmentsService.getAppointments(phcId),
        readings,
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [phcId]);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Health Worker Dashboard"
          mr="आरोग्य सेवक डॅशबोर्ड"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('PHC care queue and field records', 'प्राथमिक आरोग्य केंद्राची रांग आणि क्षेत्रीय नोंदी').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadDashboard} />}

      {!isLoading && !hasError && data && (
        <>
          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
                  {getBilingual('Assigned PHC', 'नियुक्त प्राथमिक आरोग्य केंद्र').primary}
                </p>
                <h2 className="text-lg font-bold text-content-primary mt-1">
                  {getBilingual(data.phc.name, data.phc.nameMr).primary}
                </h2>
                <p className="text-sm text-content-secondary">
                  {getBilingual(data.phc.taluka, 'रामपूर तालुका').primary}
                </p>
              </div>
              <StatusChip status={data.phc.status} />
            </div>
            {data.phc.statusReason && (
              <p className="text-sm text-content-secondary mt-3 pt-3 border-t border-surface-border">
                {getBilingual(data.phc.statusReason, data.phc.statusReasonMr).primary}
              </p>
            )}
          </section>

          <div className="grid grid-cols-2 gap-2">
            {[
              {
                value: data.patients.length,
                en: 'Assigned patients',
                mr: 'नियुक्त रुग्ण',
                icon: Users,
              },
              {
                value: data.appointments.length,
                en: 'Appointments',
                mr: 'भेटी',
                icon: CalendarDays,
              },
              {
                value: data.readings.length,
                en: 'Recorded readings',
                mr: 'नोंदवलेल्या तपासण्या',
                icon: Activity,
              },
              {
                value: data.phc.assignedVillages.length,
                en: 'Villages served',
                mr: 'सेवा दिलेली गावे',
                icon: ClipboardList,
              },
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <div key={metric.en} className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                  <Icon className="w-5 h-5 text-brand" />
                  <p className="text-xl font-bold text-content-primary mt-2">{metric.value}</p>
                  <p className="text-sm text-content-secondary">{getBilingual(metric.en, metric.mr).primary}</p>
                </div>
              );
            })}
          </div>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center justify-between">
              <BilingualText
                en="Appointment queue"
                mr="भेटीची रांग"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
              <CalendarDays className="w-5 h-5 text-brand" />
            </div>
            {data.appointments.length === 0 ? (
              <EmptyState
                titleEn="Queue is clear"
                titleMr="रांग रिकामी आहे"
                descEn="There are no appointments in the saved queue."
                descMr="जतन केलेल्या रांगेत भेटी नाहीत."
                icon={CalendarDays}
              />
            ) : (
              <div className="flex flex-col divide-y divide-surface-border mt-2">
                {data.appointments.map((appointment) => (
                  <div key={appointment.id} className="py-3 first:pt-2 last:pb-0 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-content-primary">{appointment.patientName}</p>
                      <p className="text-sm text-content-secondary mt-0.5">
                        {appointment.date} · {appointment.time} · Token #{appointment.tokenNo}
                      </p>
                      <p className="text-xs text-content-muted mt-1">
                        {getBilingual(appointment.careType, appointment.careTypeMr).primary}
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-[4px] border border-[#16A34A] bg-[#F0FDF4] text-[#166534]">
                      {getBilingual('Booked', 'बुकिंग').primary}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-brand" />
              <BilingualText
                en="Patient records ready for review"
                mr="पुनरावलोकनासाठी रुग्ण नोंदी"
                primaryClassName="text-base font-bold text-content-primary"
                secondaryClassName="text-sm text-content-secondary"
              />
            </div>
            <p className="text-sm text-content-secondary mt-2">
              {getBilingual(
                'Recorded readings are shown as care-navigation information only.',
                'नोंदवलेल्या तपासण्या केवळ काळजी-मार्गदर्शनासाठी आहेत.',
              ).primary}
            </p>
          </section>
        </>
      )}
    </div>
  );
};
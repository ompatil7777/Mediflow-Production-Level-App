import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, ClipboardList, Clock3 } from 'lucide-react';
import { appointmentsService } from '../../services/appointments';
import { Appointment } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(`${value}T00:00:00`));

const statusStyles: Record<Appointment['status'], { bg: string; border: string; text: string; labelEn: string; labelMr: string }> = {
  booked: { bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]', text: 'text-[#D97706]', labelEn: 'Booked', labelMr: 'बुकिंग' },
  checked_in: { bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]', text: 'text-[#2563EB]', labelEn: 'Checked In', labelMr: 'आले' },
  consultation: { bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]', text: 'text-[#2563EB]', labelEn: 'In Consultation', labelMr: 'तपासणीत' },
  completed: { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', text: 'text-[#16A34A]', labelEn: 'Completed', labelMr: 'पूर्ण' },
  cancelled: { bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]', text: 'text-[#DC2626]', labelEn: 'Cancelled', labelMr: 'रद्द' },
};

export const HealthWorkerQueue: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadQueue = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setAppointments(appointmentsService.getAppointments(phcId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [phcId]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      if (a.time !== b.time) return a.time.localeCompare(b.time);
      return a.tokenNo - b.tokenNo;
    });
  }, [appointments]);

  const activeAppointments = sortedAppointments.filter((a) => a.status !== 'completed' && a.status !== 'cancelled');
  const completedAppointments = sortedAppointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  const counts = useMemo(() => {
    const waiting = sortedAppointments.filter((a) => a.status === 'booked').length;
    const inProgress = sortedAppointments.filter((a) => a.status === 'checked_in' || a.status === 'consultation').length;
    const done = sortedAppointments.filter((a) => a.status === 'completed').length;
    return { waiting, inProgress, done };
  }, [sortedAppointments]);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Appointment Queue"
          mr="भेटीची रांग"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual("Today's patient flow at your PHC", 'तुमच्या केंद्रातील आजची रुग्ण रांग').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadQueue} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <Clock3 className="w-5 h-5 text-[#D97706]" />
              <p className="text-xl font-bold text-content-primary mt-2">{counts.waiting}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Waiting', 'प्रतीक्षा').primary}</p>
            </div>
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <ClipboardList className="w-5 h-5 text-[#2563EB]" />
              <p className="text-xl font-bold text-content-primary mt-2">{counts.inProgress}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Active', 'सुरू').primary}</p>
            </div>
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
              <p className="text-xl font-bold text-content-primary mt-2">{counts.done}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Done', 'पूर्ण').primary}</p>
            </div>
          </div>

          {sortedAppointments.length === 0 ? (
            <EmptyState
              titleEn="Queue is clear"
              titleMr="रांग रिकामी आहे"
              descEn="There are no appointments in the saved queue."
              descMr="जतन केलेल्या रांगेत भेटी नाहीत."
              icon={CalendarDays}
            />
          ) : (
            <>
              {activeAppointments.length > 0 && (
                <section className="bg-white border-[1.5px] border-surface-border rounded-[6px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-surface-border">
                    <BilingualText
                      en="Upcoming & active"
                      mr="आगामी व सुरू"
                      primaryClassName="text-sm font-bold text-content-primary"
                      secondaryClassName="text-xs text-content-secondary"
                    />
                  </div>
                  <div className="flex flex-col divide-y divide-surface-border">
                    {activeAppointments.map((apt) => (
                      <QueueRow key={apt.id} apt={apt} />
                    ))}
                  </div>
                </section>
              )}

              {completedAppointments.length > 0 && (
                <section className="bg-white border-[1.5px] border-surface-border rounded-[6px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-surface-border">
                    <BilingualText
                      en="Completed & cancelled"
                      mr="पूर्ण व रद्द"
                      primaryClassName="text-sm font-bold text-content-primary"
                      secondaryClassName="text-xs text-content-secondary"
                    />
                  </div>
                  <div className="flex flex-col divide-y divide-surface-border">
                    {completedAppointments.map((apt) => (
                      <QueueRow key={apt.id} apt={apt} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const QueueRow: React.FC<{ apt: Appointment }> = ({ apt }) => {
  const { getBilingual } = useLanguage();
  const style = statusStyles[apt.status];

  return (
    <div className="px-4 py-3 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[6px] bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 font-bold text-sm">
          #{apt.tokenNo}
        </div>
        <div>
          <p className="text-sm font-bold text-content-primary">{apt.patientName}</p>
          <p className="text-xs text-content-secondary mt-0.5">
            {formatDate(apt.date)} · {apt.time}
          </p>
          <p className="text-xs text-content-muted mt-0.5">
            {getBilingual(apt.careType, apt.careTypeMr).primary}
          </p>
        </div>
      </div>
      <span className={`text-xs font-semibold px-2 py-1 rounded-[4px] border ${style.bg} ${style.border} ${style.text} whitespace-nowrap`}>
        {getBilingual(style.labelEn, style.labelMr).primary}
      </span>
    </div>
  );
};

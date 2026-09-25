import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Info, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from '../../services/appointments';
import { Appointment, AppointmentSlot, PHC } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PatientOfflineNotice } from '../../components/patient/PatientOfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

const careTypes = [
  {
    en: 'General Consultation',
    mr: 'सर्वसाधारण तपासणी',
  },
  {
    en: 'Chronic Care & BP/Sugar Review',
    mr: 'नियमित आजार आणि रक्तदाब/साखर तपासणी',
  },
  {
    en: 'Follow-up Visit',
    mr: 'पुन्हा तपासणी',
  },
];

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));

export const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const { isOnline } = useSync();
  const phcId = user.phcId || 'phc-shivapur';

  const [phc, setPhc] = useState<PHC | undefined>();
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedCareType, setSelectedCareType] = useState(0);
  const [confirmation, setConfirmation] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const loadBookingData = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const nextPhc = appointmentsService.getPhc(phcId);
      if (!nextPhc) {
        throw new Error('Assigned PHC was not found');
      }

      const dates = appointmentsService.getAvailableDates(phcId);
      setPhc(nextPhc);
      setAvailableDates(dates);
      setSelectedDate((current) => (current && dates.includes(current) ? current : dates[0] || ''));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookingData();
  }, [phcId]);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedSlotId('');
      return;
    }

    try {
      const nextSlots = appointmentsService
        .getSlots(phcId, selectedDate)
        .filter((slot) => slot.booked < slot.capacity);
      setSlots(nextSlots);
      setSelectedSlotId((current) =>
        nextSlots.some((slot) => slot.id === current) ? current : nextSlots[0]?.id || '',
      );
    } catch {
      setHasError(true);
    }
  }, [phcId, selectedDate]);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId),
    [slots, selectedSlotId],
  );

  const isBookingDisabled =
    !isOnline ||
    !selectedSlot ||
    !phc ||
    phc.status !== 'consulting' ||
    isBooking;

  const bookAppointment = () => {
    if (isBookingDisabled || !selectedSlot || !phc) return;

    setIsBooking(true);
    try {
      const careType = careTypes[selectedCareType];
      const created = appointmentsService.book_appointment(
        phc.id,
        selectedSlot.date,
        selectedSlot.time,
        careType.en,
        careType.mr,
        user.patientId || 'MF-P-0001',
        user.fullName,
      );
      setConfirmation(created);
    } catch {
      setHasError(true);
    } finally {
      setIsBooking(false);
    }
  };

  if (confirmation) {
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
            en="Appointment Confirmed"
            mr="भेट निश्चित झाली"
            primaryClassName="text-xl font-bold text-content-primary"
            secondaryClassName="text-sm text-content-secondary mt-0.5"
          />
        </div>

        <section className="p-5 bg-[#F0FDF4] border-2 border-[#16A34A] rounded-[6px]">
          <div className="flex items-center gap-2 text-[#166534]">
            <CheckCircle2 className="w-6 h-6" />
            <h2 className="text-lg font-bold">
              {getBilingual('Your visit is booked', 'तुमची भेट निश्चित झाली आहे').primary}
            </h2>
          </div>
          <p className="text-sm text-[#166534] mt-1">
            {getBilingual(
              'Keep this token number for your PHC visit.',
              'प्राथमिक आरोग्य केंद्राच्या भेटीसाठी हा टोकन क्रमांक जतन करा.',
            ).primary}
          </p>

          <div className="mt-4 p-4 bg-white border border-[#86EFAC] rounded-[6px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-content-secondary">
                  {getBilingual(confirmation.phcName, confirmation.phcNameMr).primary}
                </p>
                <p className="text-base font-bold text-content-primary mt-1">
                  {formatDate(confirmation.date)}
                </p>
                <p className="text-base font-semibold text-content-primary">{confirmation.time}</p>
              </div>
              <div className="px-3 py-2 rounded-[6px] bg-brand text-white text-center">
                <span className="text-xs block">{getBilingual('Token', 'टोकन').primary}</span>
                <span className="text-2xl font-bold">#{confirmation.tokenNo}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-surface-border">
              <p className="text-sm font-semibold text-content-primary">
                {getBilingual(confirmation.careType, confirmation.careTypeMr).primary}
              </p>
              <p className="text-xs text-content-muted mt-1">
                {getBilingual('Status: Booked', 'स्थिती: बुकिंग निश्चित').primary}
              </p>
            </div>
          </div>
        </section>

        <div className="p-3 bg-surface-well border border-surface-border rounded-[6px] flex items-start gap-2">
          <Info className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
          <p className="text-sm text-content-secondary">
            {getBilingual(
              'Please arrive at the PHC during your selected time. Bring your patient ID.',
              'निवडलेल्या वेळेत केंद्रात या. तुमचा रुग्ण आयडी सोबत आणा.',
            ).primary}
          </p>
        </div>

        <Button
          enText="Back to Patient Home"
          mrText="रुग्ण मुख्यपृष्ठावर परत"
          onClick={() => navigate('/patient/home')}
        />
      </div>
    );
  }

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
          en="Book an Appointment"
          mr="भेट निश्चित करा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
      </div>

      <PatientOfflineNotice />

      {isLoading && <LoadingSkeleton rows={4} />}

      {!isLoading && hasError && <ErrorState onRetry={loadBookingData} />}

      {!isLoading && !hasError && phc && (
        <>
          <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
                  {getBilingual('Assigned PHC', 'नियुक्त प्राथमिक आरोग्य केंद्र').primary}
                </p>
                <h2 className="text-lg font-bold text-content-primary mt-1">
                  {getBilingual(phc.name, phc.nameMr).primary}
                </h2>
                <p className="text-sm text-content-secondary">
                  {getBilingual(phc.doctorName, phc.doctorNameMr).primary}
                </p>
              </div>
              <StatusChip status={phc.status} />
            </div>
            <div className="mt-3 pt-3 border-t border-surface-border flex items-start gap-2 text-sm text-content-secondary">
              <Clock3 className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
              <span>{getBilingual(phc.openingHours, phc.openingHoursMr).primary}</span>
            </div>
            {phc.status !== 'consulting' && (
              <div className="mt-3 p-3 bg-[#FFFBEB] border border-[#D97706] rounded-[6px]">
                <p className="text-sm font-semibold text-[#92400E]">
                  {getBilingual(
                    'Booking is unavailable while this PHC is not consulting.',
                    'हे केंद्र तपासणीसाठी उपलब्ध नसल्याने बुकिंग करता येणार नाही.',
                  ).primary}
                </p>
                {phc.statusReason && (
                  <p className="text-xs text-[#92400E] mt-1">
                    {getBilingual(phc.statusReason, phc.statusReasonMr).primary}
                  </p>
                )}
              </div>
            )}
          </section>

          {availableDates.length === 0 ? (
            <EmptyState
              titleEn="No appointment slots available"
              titleMr="भेटीचे स्लॉट उपलब्ध नाहीत"
              descEn="There are no open slots for this PHC in the saved schedule."
              descMr="जतन केलेल्या वेळापत्रकात या केंद्रासाठी खुले स्लॉट नाहीत."
              icon={CalendarDays}
            />
          ) : (
            <>
              <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                <BilingualText
                  en="Choose a date"
                  mr="तारीख निवडा"
                  primaryClassName="text-base font-bold text-content-primary"
                  secondaryClassName="text-sm text-content-secondary"
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {availableDates.map((date) => (
                    <button
                      type="button"
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`min-h-[52px] rounded-[6px] border-2 px-2 text-sm font-semibold ${
                        selectedDate === date
                          ? 'border-brand bg-brand/10 text-brand'
                          : 'border-surface-border bg-white text-content-primary'
                      }`}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                <BilingualText
                  en="Choose a time"
                  mr="वेळ निवडा"
                  primaryClassName="text-base font-bold text-content-primary"
                  secondaryClassName="text-sm text-content-secondary"
                />
                {slots.length === 0 ? (
                  <p className="text-sm text-content-secondary mt-3">
                    {getBilingual('No open slots for this date.', 'या तारखेसाठी खुले स्लॉट नाहीत.').primary}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {slots.map((slot) => (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`min-h-[52px] rounded-[6px] border-2 px-2 text-sm font-semibold flex flex-col items-center justify-center ${
                          selectedSlotId === slot.id
                            ? 'border-brand bg-brand/10 text-brand'
                            : 'border-surface-border bg-white text-content-primary'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Clock3 className="w-4 h-4" />
                          {slot.time}
                        </span>
                        <span className="text-xs font-normal text-content-secondary mt-0.5">
                          {slot.capacity - slot.booked} {getBilingual('slots left', 'स्लॉट शिल्लक').primary}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                <BilingualText
                  en="What is this visit for?"
                  mr="ही भेट कशासाठी आहे?"
                  primaryClassName="text-base font-bold text-content-primary"
                  secondaryClassName="text-sm text-content-secondary"
                />
                <div className="flex flex-col gap-2 mt-3">
                  {careTypes.map((careType, index) => (
                    <button
                      type="button"
                      key={careType.en}
                      onClick={() => setSelectedCareType(index)}
                      className={`min-h-[52px] px-3 rounded-[6px] border-2 text-left ${
                        selectedCareType === index
                          ? 'border-brand bg-brand/10'
                          : 'border-surface-border bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-content-primary">
                        <Stethoscope className="w-4 h-4 text-brand" />
                        {getBilingual(careType.en, careType.mr).primary}
                      </span>
                      <span className="text-xs text-content-secondary ml-6">
                        {getBilingual(careType.en, careType.mr).secondary}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <Button
                enText={isBooking ? 'Booking…' : 'Confirm Appointment'}
                mrText={isBooking ? 'बुकिंग सुरू आहे…' : 'भेट निश्चित करा'}
                onClick={bookAppointment}
                disabled={isBookingDisabled}
              />
            </>
          )}
        </>
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
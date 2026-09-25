import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock3, MapPin, Navigation, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appointmentsService } from '../../services/appointments';
import { PHC } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PatientOfflineNotice } from '../../components/patient/PatientOfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

export const NearbyPHCs: React.FC = () => {
  const navigate = useNavigate();
  const { getBilingual } = useLanguage();
  const [phcs, setPhcs] = useState<PHC[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadPhcs = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setPhcs(appointmentsService.getPhcs());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPhcs();
  }, []);

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
          en="Nearby PHCs & Directions"
          mr="जवळची प्राथमिक आरोग्य केंद्रे आणि दिशा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
      </div>

      <PatientOfflineNotice />

      {isLoading && <LoadingSkeleton rows={4} />}

      {!isLoading && hasError && <ErrorState onRetry={loadPhcs} />}

      {!isLoading && !hasError && phcs.length === 0 && (
        <EmptyState
          titleEn="No PHCs found"
          titleMr="प्राथमिक आरोग्य केंद्रे सापडली नाहीत"
          descEn="Nearby care locations are not available in the saved data."
          descMr="जतन केलेल्या माहितीमध्ये जवळची केंद्रे उपलब्ध नाहीत."
          icon={MapPin}
        />
      )}

      {!isLoading && !hasError && phcs.length > 0 && (
        <>
          <div className="p-4 bg-white border-[1.5px] border-brand rounded-[6px]">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-[6px] bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <BilingualText
                  en="Your assigned PHC"
                  mr="तुमचे नियुक्त प्राथमिक आरोग्य केंद्र"
                  primaryClassName="text-base font-bold text-content-primary"
                  secondaryClassName="text-sm text-content-secondary"
                />
                <p className="text-sm text-content-secondary mt-1">
                  {getBilingual('Directions use the saved PHC location.', 'दिशांसाठी जतन केलेले केंद्राचे स्थान वापरले जाईल.').primary}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {phcs.map((phc) => (
              <section key={phc.id} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-content-primary">
                      {getBilingual(phc.name, phc.nameMr).primary}
                    </h2>
                    <p className="text-sm text-content-secondary">
                      {getBilingual(phc.name, phc.nameMr).secondary}
                    </p>
                  </div>
                  <StatusChip status={phc.status} size="sm" />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-content-secondary">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <span>{phc.assignedVillages.join(' · ')} · {phc.taluka}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock3 className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                    <span>{getBilingual(phc.openingHours, phc.openingHoursMr).primary}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${phc.lat},${phc.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[48px] px-2 rounded-[6px] border-2 border-brand text-brand text-sm font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>{getBilingual('Directions', 'दिशा').primary}</span>
                  </a>
                  <div className="min-h-[48px] px-2 rounded-[6px] border border-surface-border bg-surface-well text-content-secondary text-sm font-medium flex items-center justify-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{phc.phone}</span>
                  </div>
                </div>
              </section>
            ))}
          </div>
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
import React, { useEffect, useState } from 'react';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { inventoryService } from '../../services/inventory';
import { StockPublic } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { PatientOfflineNotice } from '../../components/patient/PatientOfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

export const MedicineStock: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const [stock, setStock] = useState<StockPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadStock = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setStock(inventoryService.getStockPublic(user.phcId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, [user.phcId]);

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
          en="Medicine Stock"
          mr="औषध साठा"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
      </div>

      <PatientOfflineNotice />

      <div className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
        <p className="text-xs text-content-muted uppercase tracking-wide font-semibold">
          {getBilingual('Public stock view', 'सार्वजनिक साठा दृश्य').primary}
        </p>
        <h2 className="text-base font-bold text-content-primary mt-1">
          {getBilingual(
            stock[0]?.phcName || user.phcName || 'Assigned PHC',
            stock[0]?.phcNameMr || user.phcName || 'नियुक्त केंद्र',
          ).primary}
        </h2>
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual(
            'Stock information is for care navigation only.',
            'साठ्याची माहिती केवळ काळजी-मार्गदर्शनासाठी आहे.',
          ).primary}
        </p>
      </div>

      {isLoading && <LoadingSkeleton rows={6} />}

      {!isLoading && hasError && <ErrorState onRetry={loadStock} />}

      {!isLoading && !hasError && stock.length === 0 && (
        <EmptyState
          titleEn="No stock records"
          titleMr="साठ्याच्या नोंदी नाहीत"
          descEn="Medicine availability is not available for this PHC yet."
          descMr="या प्राथमिक आरोग्य केंद्रासाठी औषध उपलब्धतेची माहिती नाही."
          icon={PackageSearch}
        />
      )}

      {!isLoading && !hasError && stock.length > 0 && (
        <div className="flex flex-col gap-2">
          {stock.map((item) => (
            <section key={item.medicineId} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-[6px] bg-surface-well border border-surface-border text-brand flex items-center justify-center flex-shrink-0">
                    <PackageSearch className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-content-primary">
                      {getBilingual(item.medicineName, item.medicineNameMr).primary}
                    </h2>
                    <p className="text-sm text-content-secondary">
                      {getBilingual(item.medicineName, item.medicineNameMr).secondary}
                    </p>
                  </div>
                </div>
                <StatusChip status={item.status} size="sm" />
              </div>
              <div className="mt-3 flex items-baseline justify-between border-t border-surface-border pt-3">
                <span className="text-sm text-content-secondary">
                  {getBilingual('Current stock', 'सध्याचा साठा').primary}
                </span>
                <span className="text-lg font-bold text-content-primary">
                  {item.quantity} <span className="text-sm font-normal text-content-secondary">units</span>
                </span>
              </div>
            </section>
          ))}
        </div>
      )}

      <p className="text-xs text-content-muted text-center">
        {getBilingual(
          'Availability can change after a PHC update. Ask the PHC team before travelling.',
          'प्राथमिक आरोग्य केंद्रातील बदलांनंतर उपलब्धता बदलू शकते. प्रवासापूर्वी केंद्राला विचारा.',
        ).primary}
      </p>

      <Button
        variant="secondary"
        enText="Back to Patient Home"
        mrText="रुग्ण मुख्यपृष्ठावर परत"
        onClick={() => navigate('/patient/home')}
      />
    </div>
  );
};
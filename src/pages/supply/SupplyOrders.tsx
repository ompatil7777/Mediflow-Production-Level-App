import React, { useEffect, useMemo, useState } from 'react';
import { Truck, PackageCheck, MapPin, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { shipmentsService } from '../../services/shipments';
import { Shipment } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Modal } from '../../components/common/Modal';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

const formatDateTime = (value?: string) => {
  if (!value) return '—';
  const d = new Date(value);
  const dateStr = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(d);
  const timeStr = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
  return `${dateStr}, ${timeStr}`;
};

export const SupplyOrders: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status');
  const isDispatchMode = statusFilter === 'approved';

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [dispatchTarget, setDispatchTarget] = useState<Shipment | null>(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const loadShipments = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setShipments(shipmentsService.getShipments());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    let list = [...shipments].sort((a, b) => {
      const aTime = a.dispatchedAt || a.steps[0]?.timestamp || '';
      const bTime = b.dispatchedAt || b.steps[0]?.timestamp || '';
      return bTime.localeCompare(aTime);
    });
    if (statusFilter) {
      list = list.filter((s) => s.status === statusFilter);
    } else {
      // Deliveries tab: show dispatched / in_transit / arrived / received
      list = list.filter(
        (s) => s.status === 'dispatched' || s.status === 'in_transit' || s.status === 'arrived' || s.status === 'received' || s.status === 'inventory_updated',
      );
    }
    return list;
  }, [shipments, statusFilter]);

  const pendingDispatchCount = shipments.filter((s) => s.status === 'approved').length;
  const inTransitCount = shipments.filter((s) => s.status === 'dispatched' || s.status === 'in_transit').length;
  const deliveredCount = shipments.filter((s) => s.status === 'arrived' || s.status === 'received' || s.status === 'inventory_updated').length;

  const handleDispatchConfirm = () => {
    if (!dispatchTarget) return;
    setIsProcessing(true);
    try {
      shipmentsService.dispatch_shipment(
        dispatchTarget.id,
        vehicleNumber.trim() || 'MH-12-TR-9021',
      );
      setShipments(shipmentsService.getShipments());
      setDispatchTarget(null);
      setVehicleNumber('');
      setConfirmation(
        getBilingual(
          'Shipment dispatched. Vehicle number recorded and warehouse stock updated.',
          'खेप पाठवली. वाहन क्रमांक नोंदवला आणि गोदाम साठा अपडेट झाला.',
        ).primary,
      );
    } catch {
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkInTransit = (shipmentId: string) => {
    setIsProcessing(true);
    try {
      shipmentsService.update_shipment_status(shipmentId, 'in_transit');
      setShipments(shipmentsService.getShipments());
      setConfirmation(
        getBilingual('Shipment marked as in transit.', 'खेप मार्गावर अशी चिन्हांकित केली.').primary,
      );
    } catch {
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkArrived = (shipmentId: string) => {
    setIsProcessing(true);
    try {
      shipmentsService.update_shipment_status(shipmentId, 'arrived');
      setShipments(shipmentsService.getShipments());
      setConfirmation(
        getBilingual('Shipment marked as arrived at PHC.', 'खेप केंद्रावर पोहोचली अशी चिन्हांकित केली.').primary,
      );
    } catch {
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeDispatchModal = () => {
    setDispatchTarget(null);
    setVehicleNumber('');
  };

  const closeConfirmation = () => setConfirmation(null);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en={isDispatchMode ? 'Dispatch Orders' : 'Deliveries'}
          mr={isDispatchMode ? 'वितरण ऑर्डर्स' : 'डिलिव्हरी'}
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {isDispatchMode
            ? getBilingual(
                'Approved orders awaiting dispatch from the depot',
                'डेपोतून पाठवण्याची प्रतीक्षा करणाऱ्या मंजूर ऑर्डर्स',
              ).primary
            : getBilingual(
                'Track dispatched and in-transit shipments',
                'पाठवलेल्या आणि मार्गावरील खेपांचा मागोवा',
              ).primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadShipments} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <p className="text-xl font-bold text-[#92400E]">{pendingDispatchCount}</p>
              <p className="text-xs text-[#92400E]">{getBilingual('To Dispatch', 'पाठवायचे').primary}</p>
            </div>
            <div className="p-3 bg-[#EFF6FF] border-[1.5px] border-[#2563EB] rounded-[6px]">
              <p className="text-xl font-bold text-[#2563EB]">{inTransitCount}</p>
              <p className="text-xs text-[#2563EB]">{getBilingual('In Transit', 'मार्गावर').primary}</p>
            </div>
            <div className="p-3 bg-[#F0FDF4] border-[1.5px] border-[#16A34A] rounded-[6px]">
              <p className="text-xl font-bold text-[#16A34A]">{deliveredCount}</p>
              <p className="text-xs text-[#16A34A]">{getBilingual('Delivered', 'वितरित').primary}</p>
            </div>
          </div>

          {filteredShipments.length === 0 ? (
            <EmptyState
              titleEn={isDispatchMode ? 'No orders awaiting dispatch' : 'No deliveries in progress'}
              titleMr={isDispatchMode ? 'पाठवण्याची प्रतीक्षा करणाऱ्या ऑर्डर्स नाहीत' : 'चालू डिलिव्हरी नाहीत'}
              descEn={isDispatchMode ? 'Approved requests will appear here for dispatch.' : 'Dispatched and in-transit shipments will appear here.'}
              descMr={isDispatchMode ? 'मंजूर विनंत्या पाठवण्यासाठी येथे दिसतील.' : 'पाठवलेल्या आणि मार्गावरील खेपा येथे दिसतील.'}
              icon={isDispatchMode ? Truck : PackageCheck}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {filteredShipments.map((shipment) => (
                <div key={shipment.id} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-content-primary">
                        {getBilingual(shipment.medicineName, shipment.medicineNameMr).primary}
                      </p>
                      <p className="text-xs text-content-secondary mt-0.5">
                        {shipment.quantity} {getBilingual('units', 'युनिट्स').primary}
                      </p>
                    </div>
                    <StatusChip
                      status={shipment.status === 'inventory_updated' ? 'received' : shipment.status}
                      size="sm"
                    />
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-border">
                    <MapPin className="w-4 h-4 text-content-muted flex-shrink-0" />
                    <span className="text-xs text-content-secondary">
                      {getBilingual(shipment.phcName, shipment.phcNameMr).primary}
                    </span>
                    <span className="text-xs text-content-muted ml-auto">{shipment.id}</span>
                  </div>

                  {shipment.vehicleNumber && (
                    <p className="text-xs text-content-muted mt-1">
                      {getBilingual('Vehicle: ', 'वाहन: ').primary}{shipment.vehicleNumber}
                    </p>
                  )}

                  {shipment.dispatchedAt && (
                    <p className="text-xs text-content-muted mt-1">
                      {getBilingual('Dispatched: ', 'पाठवले: ').primary}{formatDateTime(shipment.dispatchedAt)}
                    </p>
                  )}

                  {/* Action buttons per status */}
                  {shipment.status === 'approved' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        enText="Dispatch"
                        mrText="पाठवा"
                        icon={<Truck className="w-5 h-5" />}
                        onClick={() => setDispatchTarget(shipment)}
                        disabled={isProcessing}
                        fullWidth={false}
                      />
                    </div>
                  )}

                  {shipment.status === 'dispatched' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        enText="Mark In Transit"
                        mrText="मार्गावर नोंदवा"
                        variant="outline"
                        icon={<Truck className="w-5 h-5" />}
                        onClick={() => handleMarkInTransit(shipment.id)}
                        disabled={isProcessing}
                        fullWidth={false}
                      />
                    </div>
                  )}

                  {shipment.status === 'in_transit' && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        enText="Mark Arrived"
                        mrText="पोहोचली नोंदवा"
                        variant="outline"
                        icon={<PackageCheck className="w-5 h-5" />}
                        onClick={() => handleMarkArrived(shipment.id)}
                        disabled={isProcessing}
                        fullWidth={false}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dispatch modal */}
      <Modal
        isOpen={!!dispatchTarget}
        onClose={closeDispatchModal}
        title={
          <BilingualText
            en="Dispatch Shipment"
            mr="खेप पाठवा"
            primaryClassName="text-lg font-bold text-content-primary"
            secondaryClassName="text-sm text-content-secondary"
          />
        }
      >
        <div className="flex flex-col gap-3">
          {dispatchTarget && (
            <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
              <p className="text-sm font-bold text-content-primary">
                {getBilingual(dispatchTarget.medicineName, dispatchTarget.medicineNameMr).primary}
              </p>
              <p className="text-xs text-content-secondary mt-0.5">
                {dispatchTarget.quantity} {getBilingual('units', 'युनिट्स').primary} · {getBilingual(dispatchTarget.phcName, dispatchTarget.phcNameMr).primary}
              </p>
            </div>
          )}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Vehicle number (optional)', 'वाहन क्रमांक (पर्यायी)').primary}
            </label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="MH-12-TR-9021"
              className="w-full px-3.5 py-2.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
            />
          </div>
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-content-secondary">
              <AlertCircle className="w-4 h-4" />
              <span>{getBilingual('Processing…', 'प्रक्रिया सुरू…').primary}</span>
            </div>
          )}
          <div className="flex gap-2">
            <Button
              enText="Cancel"
              mrText="रद्द करा"
              variant="outline"
              onClick={closeDispatchModal}
              fullWidth={false}
            />
            <Button
              enText="Confirm Dispatch"
              mrText="खेप पाठवा"
              onClick={handleDispatchConfirm}
              disabled={isProcessing}
              fullWidth={false}
            />
          </div>
        </div>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={!!confirmation}
        onClose={closeConfirmation}
        title={
          <BilingualText
            en="Action Recorded"
            mr="कृती नोंदवली"
            primaryClassName="text-lg font-bold text-content-primary"
            secondaryClassName="text-sm text-content-secondary"
          />
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-content-secondary">{confirmation}</p>
          <Button enText="Done" mrText="पूर्ण" onClick={closeConfirmation} />
        </div>
      </Modal>
    </div>
  );
};

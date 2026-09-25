import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { inventoryService } from '../../services/inventory';
import { requestsService } from '../../services/requests';
import { InventoryItem, ReorderRequest, RequestPriority } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSync } from '../../context/SyncContext';
import { BilingualText } from '../../components/common/BilingualText';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Modal } from '../../components/common/Modal';
import { OfflineNotice } from '../../components/common/OfflineNotice';
import { StatusChip } from '../../components/common/StatusChip';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

const priorityStyles: Record<RequestPriority, { bg: string; border: string; text: string; labelEn: string; labelMr: string }> = {
  normal: { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', text: 'text-[#16A34A]', labelEn: 'Normal', labelMr: 'सामान्य' },
  high: { bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]', text: 'text-[#D97706]', labelEn: 'High', labelMr: 'उच्च' },
  critical: { bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]', text: 'text-[#DC2626]', labelEn: 'Critical', labelMr: 'गंभीर' },
};

export const PharmacistRequests: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const { isOnline } = useSync();
  const phcId = user.phcId || 'phc-shivapur';

  const [requests, setRequests] = useState<ReorderRequest[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState('');
  const [qty, setQty] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('normal');
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [confirmation, setConfirmation] = useState<ReorderRequest | null>(null);

  const loadRequests = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setRequests(requestsService.getRequests(phcId));
      setInventory(inventoryService.getInventory(phcId));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [phcId]);

  const sortedRequests = useMemo(() => {
    const statusOrder: Record<string, number> = { pending: 0, approved: 1, dispatched: 2, received: 3, rejected: 4 };
    return [...requests].sort((a, b) => {
      const so = (statusOrder[a.status] ?? 5) - (statusOrder[b.status] ?? 5);
      if (so !== 0) return so;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [requests]);

  const pendingCount = sortedRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = sortedRequests.filter((r) => r.status === 'approved').length;

  const selectedMed = inventory.find((i) => i.medicineId === selectedMedId);
  const isFormValid = !!selectedMedId && Number(qty) > 0 && reason.trim().length > 0;

  const handleCreate = () => {
    if (!isFormValid || !selectedMed) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      const created = requestsService.create_reorder_request(
        phcId,
        selectedMedId,
        Number(qty),
        priority,
        reason.trim(),
        reason.trim(),
      );
      setConfirmation(created);
      setRequests(requestsService.getRequests(phcId));
      resetCreateForm();
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  const resetCreateForm = () => {
    setSelectedMedId('');
    setQty('');
    setPriority('normal');
    setReason('');
    setShowCreate(false);
  };

  const closeConfirmation = () => {
    setConfirmation(null);
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Reorder Requests"
          mr="पुनर्भरती विनंत्या"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Create and track medicine replenishment requests', 'औषध पुनर्भरती विनंत्या तयार करा आणि ट्रॅक करा').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadRequests} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
              <p className="text-xl font-bold text-content-primary">{sortedRequests.length}</p>
              <p className="text-xs text-content-secondary">{getBilingual('Total', 'एकूण').primary}</p>
            </div>
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <p className="text-xl font-bold text-[#92400E]">{pendingCount}</p>
              <p className="text-xs text-[#92400E]">{getBilingual('Pending', 'प्रलंबित').primary}</p>
            </div>
            <div className="p-3 bg-[#EFF6FF] border-[1.5px] border-[#2563EB] rounded-[6px]">
              <p className="text-xl font-bold text-[#2563EB]">{approvedCount}</p>
              <p className="text-xs text-[#2563EB]">{getBilingual('Approved', 'मंजूर').primary}</p>
            </div>
          </div>

          <Button
            enText="New Request"
            mrText="नवीन विनंती"
            icon={<Send className="w-5 h-5" />}
            onClick={() => setShowCreate(true)}
            disabled={!isOnline}
          />

          {sortedRequests.length === 0 ? (
            <EmptyState
              titleEn="No requests yet"
              titleMr="अद्याप विनंत्या नाहीत"
              descEn="Create a reorder request to replenish medicine stock."
              descMr="औषध साठा पुरवण्यासाठी पुनर्भरती विनंती तयार करा."
              icon={Send}
            />
          ) : (
            <div className="flex flex-col gap-2">
              {sortedRequests.map((req) => {
                const ps = priorityStyles[req.priority];
                return (
                  <div key={req.id} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-content-primary">
                          {getBilingual(req.medicineName, req.medicineNameMr).primary}
                        </p>
                        <p className="text-xs text-content-secondary mt-0.5">
                          {req.requestedQty} {getBilingual('units', 'युनिट्स').primary}
                        </p>
                      </div>
                      <StatusChip status={req.status} size="sm" />
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-border">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] border ${ps.bg} ${ps.border} ${ps.text}`}>
                        {getBilingual(ps.labelEn, ps.labelMr).primary}
                      </span>
                      <span className="text-xs text-content-muted">
                        {formatDate(req.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-content-secondary mt-2">
                      {getBilingual('Reason: ', 'कारण: ').primary}{getBilingual(req.reason, req.reasonMr).primary}
                    </p>
                    {req.rejectionReason && (
                      <p className="text-xs text-[#DC2626] mt-1">
                        {getBilingual('Rejected: ', 'नाकारले: ').primary}{getBilingual(req.rejectionReason, req.rejectionReasonMr || '').primary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <Modal
        isOpen={showCreate}
        onClose={resetCreateForm}
        title={
          <BilingualText
            en="New Reorder Request"
            mr="नवीन पुनर्भरती विनंती"
            primaryClassName="text-lg font-bold text-content-primary"
            secondaryClassName="text-sm text-content-secondary"
          />
        }
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Medicine', 'औषध').primary}
            </label>
            <select
              value={selectedMedId}
              onChange={(e) => setSelectedMedId(e.target.value)}
              className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
            >
              <option value="">{getBilingual('Select medicine…', 'औषध निवडा…').primary}</option>
              {inventory.map((item) => (
                <option key={item.medicineId} value={item.medicineId}>
                  {item.medicineName} ({item.currentStock} {getBilingual('in stock', 'साठ्यात').primary})
                </option>
              ))}
            </select>
          </div>

          {selectedMed && (
            <div className="p-2.5 bg-surface-well border border-surface-border rounded-[6px]">
              <p className="text-xs text-content-secondary">
                {getBilingual('Current stock', 'सध्याचा साठा').primary}: <span className="font-bold text-content-primary">{selectedMed.currentStock}</span>
              </p>
              <p className="text-xs text-content-secondary mt-0.5">
                {getBilingual('Reorder point', 'पुनर्भरती बिंदू').primary}: <span className="font-bold text-content-primary">{selectedMed.reorderPoint}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Quantity (units)', 'संख्या (युनिट्स)').primary}
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="100"
              className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Priority', 'प्राधान्य').primary}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'high', 'critical'] as const).map((p) => {
                const ps = priorityStyles[p];
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`min-h-[44px] rounded-[6px] border-2 px-2 text-xs font-semibold ${
                      priority === p
                        ? `${ps.bg} ${ps.border} ${ps.text}`
                        : 'border-surface-border bg-white text-content-primary'
                    }`}
                  >
                    {getBilingual(ps.labelEn, ps.labelMr).primary}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Reason', 'कारण').primary}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={getBilingual('e.g. Stock below safety threshold', 'उदा. साठा सुरक्षा मर्यादेखाली').primary}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none resize-none"
            />
          </div>

          {saveError && (
            <div className="p-3 bg-[#FEF2F2] border border-[#DC2626] rounded-[6px]">
              <p className="text-sm font-semibold text-[#DC2626]">
                {getBilingual('Could not create request. Please try again.', 'विनंती तयार करता आली नाही. कृपया पुन्हा प्रयत्न करा.').primary}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              enText="Cancel"
              mrText="रद्द करा"
              variant="outline"
              onClick={resetCreateForm}
              fullWidth={false}
            />
            <Button
              enText={isSaving ? 'Saving…' : 'Submit'}
              mrText={isSaving ? 'जतन होत आहे…' : 'सादर करा'}
              onClick={handleCreate}
              disabled={!isFormValid || isSaving}
              fullWidth={false}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmation}
        onClose={closeConfirmation}
        title={
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
            <BilingualText
              en="Request Submitted"
              mr="विनंती सादर झाली"
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
                {getBilingual(confirmation.medicineName, confirmation.medicineNameMr).primary}
              </p>
              <p className="text-base font-bold text-content-primary mt-1">
                {confirmation.requestedQty} {getBilingual('units', 'युनिट्स').primary}
              </p>
              <p className="text-xs text-content-secondary mt-1">
                {getBilingual('Priority: ', 'प्राधान्य: ').primary}{getBilingual(priorityStyles[confirmation.priority].labelEn, priorityStyles[confirmation.priority].labelMr).primary}
              </p>
            </div>
            <p className="text-sm text-content-secondary">
              {getBilingual(
                'Your request has been sent to the District Health Office for approval.',
                'तुमची विनंती जिल्हा आरोग्य कार्यालयासाठी मंजुरीसाठी पाठवली आहे.',
              ).primary}
            </p>
            <Button enText="Done" mrText="पूर्ण" onClick={closeConfirmation} />
          </div>
        )}
      </Modal>
    </div>
  );
};

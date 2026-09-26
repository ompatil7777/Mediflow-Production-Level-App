import React, { useEffect, useMemo, useState } from 'react';
import { CheckSquare, ClipboardCheck, XCircle, AlertCircle } from 'lucide-react';
import { requestsService } from '../../services/requests';
import { ReorderRequest } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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

const priorityStyles: Record<string, { bg: string; border: string; text: string; labelEn: string; labelMr: string }> = {
  normal: { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', text: 'text-[#16A34A]', labelEn: 'Normal', labelMr: 'सामान्य' },
  high: { bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]', text: 'text-[#D97706]', labelEn: 'High', labelMr: 'उच्च' },
  critical: { bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]', text: 'text-[#DC2626]', labelEn: 'Critical', labelMr: 'गंभीर' },
};

export const DistrictApprovals: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [requests, setRequests] = useState<ReorderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'decided'>('pending');
  const [rejectTarget, setRejectTarget] = useState<ReorderRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const loadRequests = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setRequests(requestsService.getRequests());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === 'pending').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const decidedRequests = useMemo(
    () => requests.filter((r) => r.status === 'approved' || r.status === 'rejected').sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [requests],
  );

  const pendingCount = pendingRequests.length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleApprove = (req: ReorderRequest) => {
    setIsProcessing(true);
    try {
      requestsService.decide_request(req.id, 'approved');
      setRequests(requestsService.getRequests());
      setConfirmation(getBilingual('Request approved. Shipment created and pharmacist notified.', 'विनंती मंजूर. खेप तयार केली आणि औषध निर्मात्याला कळवले.').primary);
    } catch {
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    setIsProcessing(true);
    try {
      requestsService.decide_request(rejectTarget.id, 'rejected', rejectReason.trim(), rejectReason.trim());
      setRequests(requestsService.getRequests());
      setRejectTarget(null);
      setRejectReason('');
      setConfirmation(getBilingual('Request rejected with reason recorded.', 'विनंती नाकारली. कारण नोंदवले.').primary);
    } catch {
      setHasError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const closeRejectModal = () => {
    setRejectTarget(null);
    setRejectReason('');
  };

  const closeConfirmation = () => setConfirmation(null);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Pending Approvals"
          mr="प्रलंबित मंजुरी"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Review and decide replenishment requests from PHCs', 'केंद्रांकडून पुनर्भरती विनंत्यांवर निर्णय करा').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadRequests} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 bg-[#FFFBEB] border-[1.5px] border-[#D97706] rounded-[6px]">
              <p className="text-xl font-bold text-[#92400E]">{pendingCount}</p>
              <p className="text-xs text-[#92400E]">{getBilingual('Pending', 'प्रलंबित').primary}</p>
            </div>
            <div className="p-3 bg-[#F0FDF4] border-[1.5px] border-[#16A34A] rounded-[6px]">
              <p className="text-xl font-bold text-[#16A34A]">{approvedCount}</p>
              <p className="text-xs text-[#16A34A]">{getBilingual('Approved', 'मंजूर').primary}</p>
            </div>
            <div className="p-3 bg-[#FEF2F2] border-[1.5px] border-[#DC2626] rounded-[6px]">
              <p className="text-xl font-bold text-[#DC2626]">{rejectedCount}</p>
              <p className="text-xs text-[#DC2626]">{getBilingual('Rejected', 'नाकारले').primary}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`min-h-[44px] rounded-[6px] border-2 px-3 text-sm font-semibold ${
                activeTab === 'pending'
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Pending', 'प्रलंबित').primary} ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decided')}
              className={`min-h-[44px] rounded-[6px] border-2 px-3 text-sm font-semibold ${
                activeTab === 'decided'
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Decided', 'निर्णय झालेले').primary} ({approvedCount + rejectedCount})
            </button>
          </div>

          {activeTab === 'pending' && (
            pendingRequests.length === 0 ? (
              <EmptyState
                titleEn="No pending approvals"
                titleMr="प्रलंबित मंजुरी नाहीत"
                descEn="All reorder requests have been reviewed and decided."
                descMr="सर्व पुनर्भरती विनंत्यांवर निर्णय झाला आहे."
                icon={ClipboardCheck}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {pendingRequests.map((req) => {
                  const ps = priorityStyles[req.priority];
                  return (
                    <div key={req.id} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-content-primary">
                            {getBilingual(req.medicineName, req.medicineNameMr).primary}
                          </p>
                          <p className="text-xs text-content-secondary mt-0.5">{req.phcName}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] border ${ps.bg} ${ps.border} ${ps.text}`}>
                          {getBilingual(ps.labelEn, ps.labelMr).primary}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-surface-border">
                        <span className="text-base font-bold text-content-primary">{req.requestedQty}</span>
                        <span className="text-xs text-content-secondary">{getBilingual('units requested', 'युनिट्स विनंती').primary}</span>
                        <span className="text-xs text-content-muted ml-auto">{formatDate(req.createdAt)}</span>
                      </div>

                      <p className="text-xs text-content-secondary mt-2">
                        {getBilingual('Reason: ', 'कारण: ').primary}{getBilingual(req.reason, req.reasonMr).primary}
                      </p>

                      <div className="flex gap-2 mt-3">
                        <Button
                          enText="Approve"
                          mrText="मंजूर"
                          icon={<CheckSquare className="w-5 h-5" />}
                          onClick={() => handleApprove(req)}
                          disabled={isProcessing}
                          fullWidth={false}
                        />
                        <Button
                          enText="Reject"
                          mrText="नाकारा"
                          variant="destructive"
                          icon={<XCircle className="w-5 h-5" />}
                          onClick={() => setRejectTarget(req)}
                          disabled={isProcessing}
                          fullWidth={false}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'decided' && (
            decidedRequests.length === 0 ? (
              <EmptyState
                titleEn="No decided requests"
                titleMr="निर्णय झालेल्या विनंत्या नाहीत"
                descEn="Approved and rejected requests will appear here."
                descMr="मंजूर आणि नाकारलेल्या विनंत्या येथे दिसतील."
                icon={CheckSquare}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {decidedRequests.map((req) => {
                  const ps = priorityStyles[req.priority];
                  return (
                    <div key={req.id} className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-content-primary">
                            {getBilingual(req.medicineName, req.medicineNameMr).primary}
                          </p>
                          <p className="text-xs text-content-secondary mt-0.5">{req.phcName} · {req.requestedQty} {getBilingual('units', 'युनिट्स').primary}</p>
                        </div>
                        <StatusChip status={req.status} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-surface-border">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-[4px] border ${ps.bg} ${ps.border} ${ps.text}`}>
                          {getBilingual(ps.labelEn, ps.labelMr).primary}
                        </span>
                        <span className="text-xs text-content-muted ml-auto">{formatDate(req.updatedAt)}</span>
                      </div>
                      {req.rejectionReason && (
                        <p className="text-xs text-[#DC2626] mt-2">
                          {getBilingual('Rejected: ', 'नाकारले: ').primary}{getBilingual(req.rejectionReason, req.rejectionReasonMr || '').primary}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}
        </>
      )}

      <Modal
        isOpen={!!rejectTarget}
        onClose={closeRejectModal}
        title={
          <BilingualText
            en="Reject Request"
            mr="विनंती नाकारा"
            primaryClassName="text-lg font-bold text-content-primary"
            secondaryClassName="text-sm text-content-secondary"
          />
        }
      >
        <div className="flex flex-col gap-3">
          {rejectTarget && (
            <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
              <p className="text-sm font-bold text-content-primary">
                {getBilingual(rejectTarget.medicineName, rejectTarget.medicineNameMr).primary}
              </p>
              <p className="text-xs text-content-secondary mt-0.5">
                {rejectTarget.phcName} · {rejectTarget.requestedQty} {getBilingual('units', 'युनिट्स').primary}
              </p>
            </div>
          )}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-content-secondary mb-1">
              {getBilingual('Reason for rejection (required)', 'नाकारण्याचे कारण (आवश्यक)').primary}
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={getBilingual('e.g. Budget reallocation or sufficient stock at depot', 'उदा. बजेट पुनर्नियोजन किंवा गोदामात पुरेसा साठा').primary}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand focus:outline-none resize-none"
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
              onClick={closeRejectModal}
              fullWidth={false}
            />
            <Button
              enText="Confirm Reject"
              mrText="नकार नोंदवा"
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim() || isProcessing}
              fullWidth={false}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmation}
        onClose={closeConfirmation}
        title={
          <BilingualText
            en="Decision Recorded"
            mr="निर्णय नोंदवला"
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

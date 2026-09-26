import React, { useEffect, useMemo, useState } from 'react';
import { FileSearch, Activity, Package, Truck, ClipboardList, ShieldCheck } from 'lucide-react';
import { store } from '../../data/store';
import { AuditLog, ActivityLog, Shipment, ReorderRequest } from '../../types';
import { requestsService } from '../../services/requests';
import { shipmentsService } from '../../services/shipments';
import { classifyRootCause, RootCauseInvestigation } from '../../engines/rootCause';
import { useLanguage } from '../../context/LanguageContext';
import { BilingualText } from '../../components/common/BilingualText';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { OfflineNotice } from '../../components/common/OfflineNotice';

const formatDateTime = (value: string) => {
  const d = new Date(value);
  const dateStr = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(d);
  const timeStr = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
  return `${dateStr}, ${timeStr}`;
};

const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  inventory: Package,
  shipment: Truck,
  appointment: ClipboardList,
  approval: ClipboardList,
  clinical: Activity,
};

const rootCauseCategoryStyles: Record<string, { bg: string; border: string; text: string }> = {
  APPROVAL_DELAY: { bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]', text: 'text-[#D97706]' },
  SUPPLY_DELAY: { bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]', text: 'text-[#2563EB]' },
  UNEXPECTED_DEMAND: { bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]', text: 'text-[#D97706]' },
  WAREHOUSE_SHORTAGE: { bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]', text: 'text-[#DC2626]' },
  DATA_ENTRY_ISSUE: { bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]', text: 'text-[#DC2626]' },
  NONE_NORMAL: { bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]', text: 'text-[#16A34A]' },
};

interface AuditData {
  activityLogs: ActivityLog[];
  auditLogs: AuditLog[];
  requests: ReorderRequest[];
  shipments: Shipment[];
}

export const DistrictAuditTrail: React.FC = () => {
  const { getBilingual } = useLanguage();
  const [data, setData] = useState<AuditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'audit' | 'rootcause'>('activity');

  const loadAudit = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setData({
        activityLogs: [...store.activityLogs],
        auditLogs: [...store.auditLogs],
        requests: requestsService.getRequests(),
        shipments: shipmentsService.getShipments(),
      });
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAudit();
  }, []);

  const sortedActivity = useMemo(
    () => [...(data?.activityLogs || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data],
  );

  const sortedAudit = useMemo(
    () => [...(data?.auditLogs || [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data],
  );

  const rootCauseInvestigations: RootCauseInvestigation[] = useMemo(() => {
    if (!data) return [];
    const investigations: RootCauseInvestigation[] = [];

    for (const req of data.requests) {
      if (req.status === 'pending') {
        const hoursPending = (Date.now() - new Date(req.createdAt).getTime()) / 3600000;
        const inv = classifyRootCause({ hoursPendingApproval: hoursPending });
        if (inv.category !== 'NONE_NORMAL') {
          investigations.push({ ...inv, title: `${req.medicineName} — ${inv.title}`, titleMr: `${req.medicineNameMr} — ${inv.titleMr}` });
        }
      }
    }

    for (const shp of data.shipments) {
      if (shp.status === 'in_transit' || shp.status === 'dispatched') {
        const daysInTransit = shp.dispatchedAt
          ? (Date.now() - new Date(shp.dispatchedAt).getTime()) / 86400000
          : 0;
        const inv = classifyRootCause({ daysInTransit: Math.round(daysInTransit), expectedLeadTimeDays: 7 });
        if (inv.category !== 'NONE_NORMAL') {
          investigations.push({ ...inv, title: `${shp.medicineName} — ${inv.title}`, titleMr: `${shp.medicineNameMr} — ${inv.titleMr}` });
        }
      }
    }

    if (investigations.length === 0) {
      investigations.push(classifyRootCause({}));
    }

    return investigations;
  }, [data]);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="Audit Trail"
          mr="ऑडिट ट्रेल"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Complete activity log, audit records, and root-cause analysis', 'संपूर्ण कार्य नोंद, ऑडिट आणि मूळ कारण विश्लेषण').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadAudit} />}

      {!isLoading && !hasError && data && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`min-h-[44px] rounded-[6px] border-2 px-2 text-xs font-semibold ${
                activeTab === 'activity' ? 'border-brand bg-brand/10 text-brand' : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Activity', 'कार्य').primary}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`min-h-[44px] rounded-[6px] border-2 px-2 text-xs font-semibold ${
                activeTab === 'audit' ? 'border-brand bg-brand/10 text-brand' : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Audit Log', 'ऑडिट').primary}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rootcause')}
              className={`min-h-[44px] rounded-[6px] border-2 px-2 text-xs font-semibold ${
                activeTab === 'rootcause' ? 'border-brand bg-brand/10 text-brand' : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Root Cause', 'मूळ कारण').primary}
            </button>
          </div>

          {activeTab === 'activity' && (
            sortedActivity.length === 0 ? (
              <EmptyState
                titleEn="No activity recorded"
                titleMr="कार्य नोंदवले नाहीत"
                descEn="District-wide activity will appear here as actions occur."
                descMr="क्रिया घडत असताना जिल्हास्तरीय कार्य येथे दिसेल."
                icon={Activity}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {sortedActivity.map((log) => {
                  const Icon = categoryIcon[log.category] || Activity;
                  return (
                    <div key={log.id} className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-[6px] bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-content-primary">
                            {getBilingual(log.message, log.messageMr).primary}
                          </p>
                          {log.phcName && (
                            <p className="text-xs text-content-muted mt-0.5">{log.phcName}</p>
                          )}
                          <p className="text-xs text-content-muted mt-0.5">{formatDateTime(log.createdAt)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {activeTab === 'audit' && (
            sortedAudit.length === 0 ? (
              <EmptyState
                titleEn="No audit records"
                titleMr="ऑडिट नोंदी नाहीत"
                descEn="System actions and their before/after states will be logged here."
                descMr="प्रणाली क्रिया आणि त्यांच्या आधीच्या/नंतरच्या स्थिती येथे नोंदवल्या जातील."
                icon={ShieldCheck}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {sortedAudit.map((log) => (
                  <div key={log.id} className="p-3 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-content-primary">{log.action}</p>
                      <span className="text-xs text-content-muted whitespace-nowrap">{formatDateTime(log.createdAt)}</span>
                    </div>
                    <p className="text-xs text-content-secondary mt-1">
                      {getBilingual('By ', 'यांनी: ').primary}{log.actorName}
                    </p>
                    <div className="mt-2 pt-2 border-t border-surface-border">
                      <p className="text-xs text-content-muted">
                        {getBilingual('Entity', 'घटक').primary}: {log.entity} ({log.entityId})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'rootcause' && (
            <div className="flex flex-col gap-2">
              <div className="p-3 bg-surface-well border border-surface-border rounded-[6px]">
                <p className="text-xs text-content-muted">
                  {getBilingual('Rule-based classification, not AI. Each finding shows the rule triggered and recommended action.', 'नियम-आधारित वर्गीकरण, AI नाही. प्रत्येक निष्कर्षात नियम आणि सुद्धा सूचित केली आहे.').primary}
                </p>
              </div>
              {rootCauseInvestigations.map((inv, idx) => {
                const styles = rootCauseCategoryStyles[inv.category] || rootCauseCategoryStyles.NONE_NORMAL;
                return (
                  <div key={idx} className="p-4 bg-white border-[1.5px] border-surface-border rounded-[6px]">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center flex-shrink-0 border ${styles.bg} ${styles.border}`}>
                        <FileSearch className={`w-5 h-5 ${styles.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-content-primary">
                          {getBilingual(inv.title, inv.titleMr).primary}
                        </p>
                        <p className="text-sm text-content-secondary mt-1">
                          {getBilingual(inv.explanation, inv.explanationMr).primary}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-surface-border flex flex-col gap-2">
                      <div>
                        <p className="text-xs font-semibold text-content-secondary mb-0.5">
                          {getBilingual('Rule triggered', 'नियम').primary}
                        </p>
                        <p className="text-xs text-content-muted">
                          {getBilingual(inv.ruleTriggered, inv.ruleTriggeredMr).primary}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-content-secondary mb-0.5">
                          {getBilingual('Recommended action', 'सुद्धा').primary}
                        </p>
                        <p className="text-xs text-content-primary">
                          {getBilingual(inv.recommendedAction, inv.recommendedActionMr).primary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

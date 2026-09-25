import React, { useEffect, useMemo, useState } from 'react';
import { History, Package, Truck, ClipboardList, Activity } from 'lucide-react';
import { store } from '../../data/store';
import { ActivityLog, AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
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

export const PharmacistHistory: React.FC = () => {
  const { user } = useAuth();
  const { getBilingual } = useLanguage();
  const phcId = user.phcId || 'phc-shivapur';

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'activity' | 'audit'>('activity');

  const loadHistory = () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setActivityLogs(
        store.activityLogs.filter(
          (l) => l.category === 'inventory' || l.category === 'shipment' || l.category === 'approval',
        ),
      );
      setAuditLogs(
        store.auditLogs.filter(
          (l) => l.entity === 'inventory' || l.entity === 'reorder_requests' || l.entity === 'shipments',
        ),
      );
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [phcId]);

  const sortedActivity = useMemo(() => {
    return [...activityLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [activityLogs]);

  const sortedAudit = useMemo(() => {
    return [...auditLogs].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [auditLogs]);

  return (
    <div className="w-full flex flex-col gap-3 pb-4">
      <div>
        <BilingualText
          en="History"
          mr="इतिहास"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary mt-0.5"
        />
        <p className="text-sm text-content-secondary mt-1">
          {getBilingual('Recent inventory and shipment activity at your PHC', 'तुमच्या केंद्रातील अलीकडील साठा आणि वाहतूक कार्य').primary}
        </p>
      </div>

      <OfflineNotice />

      {isLoading && <LoadingSkeleton rows={5} />}
      {!isLoading && hasError && <ErrorState onRetry={loadHistory} />}

      {!isLoading && !hasError && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`min-h-[44px] rounded-[6px] border-2 px-3 text-sm font-semibold ${
                activeTab === 'activity'
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Activity Feed', 'कार्य फीड').primary}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('audit')}
              className={`min-h-[44px] rounded-[6px] border-2 px-3 text-sm font-semibold ${
                activeTab === 'audit'
                  ? 'border-brand bg-brand/10 text-brand'
                  : 'border-surface-border bg-white text-content-primary'
              }`}
            >
              {getBilingual('Audit Trail', 'ऑडिट ट्रेल').primary}
            </button>
          </div>

          {activeTab === 'activity' && (
            sortedActivity.length === 0 ? (
              <EmptyState
                titleEn="No activity yet"
                titleMr="अद्याप कार्य नाही"
                descEn="Inventory and shipment actions will appear here."
                descMr="साठा आणि वाहतूक क्रिया येथे दिसतील."
                icon={History}
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
                            <p className="text-xs text-content-muted mt-0.5">
                              {log.phcName}
                            </p>
                          )}
                          <p className="text-xs text-content-muted mt-0.5">
                            {formatDateTime(log.createdAt)}
                          </p>
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
                descEn="Stock and request changes will be logged here."
                descMr="साठा आणि विनंती बदल येथे नोंदवले जातील."
                icon={History}
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
        </>
      )}
    </div>
  );
};

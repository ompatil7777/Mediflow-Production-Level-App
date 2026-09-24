import { store } from '../data/store';
import { ActivityLog, AuditLog } from '../types';

export const notificationsService = {
  getActivityLogs(phcId?: string): ActivityLog[] {
    if (!phcId) return store.activityLogs;
    return store.activityLogs.filter((a) => !a.phcId || a.phcId === phcId);
  },

  getAuditLogs(): AuditLog[] {
    return store.auditLogs;
  },
};

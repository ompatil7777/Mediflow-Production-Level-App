import { store } from '../data/store';
import { ReorderRequest } from '../types';

export const requestsService = {
  getRequests(phcId?: string): ReorderRequest[] {
    if (!phcId) return store.requests;
    return store.requests.filter((r) => r.phcId === phcId);
  },

  getRequest(id: string): ReorderRequest | undefined {
    return store.requests.find((r) => r.id === id);
  },

  create_reorder_request(
    phcId: string,
    medicineId: string,
    qty: number,
    priority: ReorderRequest['priority'],
    reason: string,
    reasonMr: string
  ): ReorderRequest {
    return store.create_reorder_request(phcId, medicineId, qty, priority, reason, reasonMr);
  },

  decide_request(requestId: string, decision: 'approved' | 'rejected', reason?: string, reasonMr?: string): void {
    store.decide_request(requestId, decision, reason, reasonMr);
  },
};

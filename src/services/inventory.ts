import { store } from '../data/store';
import { InventoryItem, StockPublic } from '../types';

export const inventoryService = {
  getInventory(phcId?: string): InventoryItem[] {
    if (!phcId) return store.inventory;
    return store.inventory.filter((i) => i.phcId === phcId);
  },

  getInventoryItem(id: string): InventoryItem | undefined {
    return store.inventory.find((i) => i.id === id || i.medicineId === id);
  },

  getStockPublic(phcId?: string): StockPublic[] {
    const targetPhcId = phcId || 'phc-shivapur';
    const items = store.inventory.filter((i) => i.phcId === targetPhcId);
    const phc = store.phcs.find((p) => p.id === targetPhcId) || store.phcs[0];

    return items.map((i) => ({
      phcId: targetPhcId,
      phcName: phc.name,
      phcNameMr: phc.nameMr,
      medicineId: i.medicineId,
      medicineName: i.medicineName,
      medicineNameMr: i.medicineNameMr,
      quantity: i.currentStock,
      status: i.status,
      updatedAt: i.updatedAt,
    }));
  },

  update_stock(inventoryId: string, newStock: number, reason: string): void {
    store.update_stock(inventoryId, newStock, reason);
  },
};

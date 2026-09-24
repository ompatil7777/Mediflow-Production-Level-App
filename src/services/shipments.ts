import { store } from '../data/store';
import { Shipment, WarehouseStockItem } from '../types';

export const shipmentsService = {
  getShipments(phcId?: string): Shipment[] {
    if (!phcId) return store.shipments;
    return store.shipments.filter((s) => s.phcId === phcId);
  },

  getShipment(id: string): Shipment | undefined {
    return store.shipments.find((s) => s.id === id);
  },

  getWarehouseStock(): WarehouseStockItem[] {
    return store.warehouseStock;
  },

  dispatch_shipment(shipmentId: string, vehicleNumber?: string): void {
    store.dispatch_shipment(shipmentId, vehicleNumber);
  },

  update_shipment_status(shipmentId: string, status: 'in_transit' | 'arrived'): void {
    store.update_shipment_status(shipmentId, status);
  },

  receive_shipment(shipmentId: string): void {
    store.receive_shipment(shipmentId);
  },
};

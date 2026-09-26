import {
  PHC,
  InventoryItem,
  ReorderRequest,
  Shipment,
  WarehouseStockItem,
  AuditLog,
  ActivityLog,
  Appointment,
  HealthReading,
  UserProfile,
  Patient,
  PhcStatus,
} from '../types';
import {
  MOCK_PHCS,
  INITIAL_INVENTORY,
  INITIAL_WAREHOUSE_STOCK,
  DEMO_PROFILES,
  MOCK_PATIENTS,
  MOCK_HEALTH_READINGS,
  MOCK_APPOINTMENTS,
  MOCK_APPOINTMENT_SLOTS,
} from './mockData';

class MediFlowStore {
  public phcs: PHC[] = [...MOCK_PHCS];
  public inventory: InventoryItem[] = [...INITIAL_INVENTORY];
  public warehouseStock: WarehouseStockItem[] = [...INITIAL_WAREHOUSE_STOCK];
  public patients: Patient[] = [...MOCK_PATIENTS];
  public healthReadings: HealthReading[] = [...MOCK_HEALTH_READINGS];
  public appointments: Appointment[] = [...MOCK_APPOINTMENTS];
  public appointmentSlots = [...MOCK_APPOINTMENT_SLOTS];
  public requests: ReorderRequest[] = [
    {
      id: 'req-init-1',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      phcNameMr: 'प्रा. आ. केंद्र शिवापूर',
      medicineId: 'med-4',
      medicineName: 'Losartan 50mg',
      medicineNameMr: 'लोसार्टन ५० मि.ग्रॅ.',
      requestedQty: 150,
      priority: 'high',
      reason: 'Stock below emergency safety threshold',
      reasonMr: 'साठा आणीबाणीच्या सुरक्षा मर्यादेखाली आला आहे',
      status: 'approved',
      createdBy: 'Ganesh Jadhav',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: 'req-pending-1',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      phcNameMr: 'प्रा. आ. केंद्र शिवापूर',
      medicineId: 'med-2',
      medicineName: 'Metformin 500mg',
      medicineNameMr: 'मेटफॉर्मिन ५०० मि.ग्रॅ.',
      requestedQty: 200,
      priority: 'high',
      reason: 'Stock at 84 units, below reorder point of 114',
      reasonMr: 'साठा ८४ युनिट्सवर, पुनर्भरती बिंदू ११४ पेक्षा कमी',
      status: 'pending',
      createdBy: 'Ganesh Jadhav',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'req-pending-2',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      phcNameMr: 'प्रा. आ. केंद्र शिवापूर',
      medicineId: 'med-10',
      medicineName: 'Calcium tablets',
      medicineNameMr: 'कॅल्शियम गोळ्या',
      requestedQty: 300,
      priority: 'critical',
      reason: 'Completely out of stock, patients turned away',
      reasonMr: 'साठा संपला, रुग्णांना परत पाठवले',
      status: 'pending',
      createdBy: 'Ganesh Jadhav',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
  public shipments: Shipment[] = [
    {
      id: 'shp-init-1',
      requestId: 'req-init-1',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      phcNameMr: 'प्रा. आ. केंद्र शिवापूर',
      medicineId: 'med-4',
      medicineName: 'Losartan 50mg',
      medicineNameMr: 'लोसार्टन ५० मि.ग्रॅ.',
      quantity: 150,
      status: 'in_transit',
      vehicleNumber: 'MH-12-TR-9021',
      dispatchedAt: new Date(Date.now() - 14400000).toISOString(),
      steps: [
        {
          status: 'approved',
          actorId: 'usr-meena',
          actorName: 'Dr. Meena Kulkarni',
          actorRole: 'District Health Office',
          actorRoleMr: 'जिल्हा आरोग्य कार्यालय',
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          note: 'Approved for urgent clinic replenishment',
          noteMr: 'तातडीच्या क्लिनिक पुनर्भरतीसाठी मंजूर',
        },
        {
          status: 'dispatched',
          actorId: 'usr-rajesh',
          actorName: 'Rajesh Pawar',
          actorRole: 'Supply Depot',
          actorRoleMr: 'पुरवठा डेपो',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          note: 'Dispatched via Taluka Delivery Van #3',
          noteMr: 'तालुका वितरण व्हॅन #३ द्वारे पाठवले',
        },
      ],
    },
  ];
  public auditLogs: AuditLog[] = [
    {
      id: 'aud-1',
      actorId: 'usr-ganesh',
      actorName: 'Ganesh Jadhav',
      actorRole: 'pharmacist',
      actorRoleMr: 'औषध निर्माता',
      action: 'STOCK_DISPENSE',
      entity: 'inventory',
      entityId: 'inv-shiv-metformin',
      previousValue: JSON.stringify({ currentStock: 96 }),
      newValue: JSON.stringify({ currentStock: 84, status: 'low' }),
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
  ];
  public activityLogs: ActivityLog[] = [
    {
      id: 'act-1',
      category: 'inventory',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      message: 'Dispensed 12 units of Metformin 500mg. Stock reached LOW threshold (84 units).',
      messageMr: 'मेटफॉर्मिन ५०० मि.ग्रॅ. चे १२ युनिट्स वितरित. साठा कमी पातळीवर (८४ युनिट्स) पोहोचला.',
      createdAt: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: 'act-2',
      category: 'shipment',
      phcId: 'phc-shivapur',
      phcName: 'PHC Shivapur',
      message: 'Shipment #shp-init-1 (Losartan 50mg, 150 units) marked IN TRANSIT.',
      messageMr: 'मालवाहू खेप #shp-init-1 (लोसार्टन ५० मि.ग्रॅ., १५० युनिट्स) मार्गावर आहे.',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
    },
  ];

  public currentProfile: UserProfile = DEMO_PROFILES[0]; // Default: Ramesh Patil (Patient)
  private listeners: Set<() => void> = new Set();
  public updatedEntityId: string | null = null;

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(entityId?: string) {
    this.updatedEntityId = entityId || null;
    this.listeners.forEach((l) => l());
    setTimeout(() => {
      this.updatedEntityId = null;
    }, 1000);
  }

  // Auth / Role switcher
  public setDemoRole(role: UserProfile['role']) {
    const p = DEMO_PROFILES.find((profile) => profile.role === role);
    if (p) {
      this.currentProfile = p;
      this.notify();
    }
  }

  // RPC: set_phc_status
  public set_phc_status(phcId: string, status: PhcStatus, reason?: string, reasonMr?: string) {
    const phc = this.phcs.find((p) => p.id === phcId);
    if (!phc) return;

    const prev = phc.status;
    phc.status = status;
    phc.statusReason = reason;
    phc.statusReasonMr = reasonMr;
    phc.updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'आरोग्य सेवक',
      action: 'UPDATE_PHC_STATUS',
      entity: 'phcs',
      entityId: phcId,
      previousValue: JSON.stringify({ status: prev }),
      newValue: JSON.stringify({ status, reason }),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'clinical',
      phcId: phc.id,
      phcName: phc.name,
      message: `${phc.name} operational status updated to ${status.toUpperCase()}.`,
      messageMr: `${phc.nameMr} ची स्थिती बदलून ${status === 'consulting' ? 'सुरू' : status === 'paused' ? 'तात्पुरते बंद' : 'बंद'} करण्यात आली.`,
      createdAt: new Date().toISOString(),
    });

    this.notify(phcId);
  }

  // RPC: update_stock
  public update_stock(inventoryId: string, newStock: number, reason: string) {
    const item = this.inventory.find((i) => i.id === inventoryId);
    if (!item) return;

    const prevStock = item.currentStock;
    item.currentStock = Math.max(0, newStock);
    if (item.currentStock === 0) {
      item.status = 'out';
    } else if (item.currentStock < item.reorderPoint) {
      item.status = 'low';
    } else {
      item.status = 'available';
    }
    item.updatedAt = new Date().toISOString();

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'औषध निर्माता',
      action: 'UPDATE_STOCK',
      entity: 'inventory',
      entityId: inventoryId,
      previousValue: JSON.stringify({ currentStock: prevStock }),
      newValue: JSON.stringify({ currentStock: item.currentStock, status: item.status, reason }),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'inventory',
      phcId: item.phcId,
      message: `Updated stock for ${item.medicineName}: ${prevStock} -> ${item.currentStock} units (${reason}).`,
      messageMr: `${item.medicineNameMr} चा साठा अपडेट केला: ${prevStock} -> ${item.currentStock} (${reason}).`,
      createdAt: new Date().toISOString(),
    });

    this.notify(inventoryId);
  }

  // RPC: create_reorder_request
  public create_reorder_request(
    phcId: string,
    medicineId: string,
    qty: number,
    priority: ReorderRequest['priority'],
    reason: string,
    reasonMr: string
  ): ReorderRequest {
    const phc = this.phcs.find((p) => p.id === phcId) || this.phcs[0];
    const med = this.inventory.find((i) => i.medicineId === medicineId) || this.inventory[0];

    const newReq: ReorderRequest = {
      id: `req-${Date.now()}`,
      phcId,
      phcName: phc.name,
      phcNameMr: phc.nameMr,
      medicineId,
      medicineName: med.medicineName,
      medicineNameMr: med.medicineNameMr,
      requestedQty: qty,
      priority,
      reason,
      reasonMr,
      status: 'pending',
      createdBy: this.currentProfile.fullName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.requests.unshift(newReq);

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'औषध निर्माता',
      action: 'CREATE_REORDER_REQUEST',
      entity: 'reorder_requests',
      entityId: newReq.id,
      previousValue: '{}',
      newValue: JSON.stringify(newReq),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'inventory',
      phcId,
      phcName: phc.name,
      message: `New replenishment request for ${qty} units of ${med.medicineName} created (Priority: ${priority}).`,
      messageMr: `${med.medicineNameMr} साठी ${qty} युनिट्सची नवीन पुनर्भरती विनंती तयार केली (प्राधान्य: ${priority}).`,
      createdAt: new Date().toISOString(),
    });

    this.notify(newReq.id);
    return newReq;
  }

  // RPC: decide_request (District Health Office approve/reject)
  public decide_request(requestId: string, decision: 'approved' | 'rejected', reason?: string, reasonMr?: string) {
    const req = this.requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = decision;
    req.updatedAt = new Date().toISOString();

    if (decision === 'rejected') {
      req.rejectionReason = reason || 'Budget reallocation';
      req.rejectionReasonMr = reasonMr || 'बजेट पुनर्नियोजन';
    } else if (decision === 'approved') {
      // Auto-create shipment in 'approved' status
      const newShipment: Shipment = {
        id: `shp-${Date.now()}`,
        requestId: req.id,
        phcId: req.phcId,
        phcName: req.phcName,
        phcNameMr: req.phcNameMr,
        medicineId: req.medicineId,
        medicineName: req.medicineName,
        medicineNameMr: req.medicineNameMr,
        quantity: req.requestedQty,
        status: 'approved',
        steps: [
          {
            status: 'approved',
            actorId: this.currentProfile.userId,
            actorName: this.currentProfile.fullName,
            actorRole: 'District Health Office',
            actorRoleMr: 'जिल्हा आरोग्य कार्यालय',
            timestamp: new Date().toISOString(),
            note: 'Approved by District Health Officer',
            noteMr: 'जिल्हा आरोग्य अधिकाऱ्यांकडून मंजूर',
          },
        ],
      };
      this.shipments.unshift(newShipment);
    }

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'जिल्हा आरोग्य कार्यालय',
      action: decision === 'approved' ? 'APPROVE_REQUEST' : 'REJECT_REQUEST',
      entity: 'reorder_requests',
      entityId: req.id,
      previousValue: JSON.stringify({ status: 'pending' }),
      newValue: JSON.stringify({ status: decision, reason }),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'approval',
      phcId: req.phcId,
      phcName: req.phcName,
      message: `Replenishment request for ${req.medicineName} was ${decision.toUpperCase()} by District Health Office.`,
      messageMr: `${req.medicineNameMr} ची पुनर्भरती विनंती जिल्हा आरोग्य कार्यालयाकडून ${decision === 'approved' ? 'मंजूर' : 'नाकारण्यात'} आली.`,
      createdAt: new Date().toISOString(),
    });

    this.notify(requestId);
  }

  // RPC: dispatch_shipment (Supply Depot)
  public dispatch_shipment(shipmentId: string, vehicleNumber: string = 'MH-12-TR-9021') {
    const shp = this.shipments.find((s) => s.id === shipmentId);
    if (!shp) return;

    // Decrement warehouse stock
    const whItem = this.warehouseStock.find((w) => w.medicineId === shp.medicineId);
    if (whItem) {
      whItem.quantity = Math.max(0, whItem.quantity - shp.quantity);
    }

    shp.status = 'dispatched';
    shp.vehicleNumber = vehicleNumber;
    shp.dispatchedAt = new Date().toISOString();
    shp.steps.push({
      status: 'dispatched',
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: 'Supply Depot',
      actorRoleMr: 'पुरवठा डेपो',
      timestamp: new Date().toISOString(),
      note: `Dispatched in vehicle ${vehicleNumber}. Warehouse stock decremented.`,
      noteMr: `वाहन ${vehicleNumber} मध्ये पाठवले. गोदामातील साठा वजा केला.`,
    });

    // Update parent request status
    const req = this.requests.find((r) => r.id === shp.requestId);
    if (req) {
      req.status = 'dispatched';
      req.updatedAt = new Date().toISOString();
    }

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'पुरवठा डेपो',
      action: 'DISPATCH_SHIPMENT',
      entity: 'shipments',
      entityId: shp.id,
      previousValue: JSON.stringify({ status: 'approved' }),
      newValue: JSON.stringify({ status: 'dispatched', vehicleNumber, warehouseRemaining: whItem?.quantity }),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'shipment',
      phcId: shp.phcId,
      phcName: shp.phcName,
      message: `Shipment of ${shp.quantity} units of ${shp.medicineName} dispatched from Supply Depot.`,
      messageMr: `${shp.medicineNameMr} चे ${shp.quantity} युनिट्स गोदामातून पाठवले गेले.`,
      createdAt: new Date().toISOString(),
    });

    this.notify(shipmentId);
  }

  // RPC: update_shipment_status (Supply Depot mark in_transit / arrived)
  public update_shipment_status(shipmentId: string, status: 'in_transit' | 'arrived') {
    const shp = this.shipments.find((s) => s.id === shipmentId);
    if (!shp) return;

    shp.status = status;
    if (status === 'arrived') {
      shp.arrivedAt = new Date().toISOString();
    }
    shp.steps.push({
      status,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: 'Supply Depot',
      actorRoleMr: 'पुरवठा डेपो',
      timestamp: new Date().toISOString(),
      note: `Shipment status updated to ${status}.`,
      noteMr: `खेपेची स्थिती ${status === 'in_transit' ? 'मार्गावर' : 'पोहोचली'} अशी बदलली.`,
    });

    this.notify(shipmentId);
  }

  // RPC: receive_shipment (Pharmacist completes the loop: Metformin 84 -> 284!)
  public receive_shipment(shipmentId: string) {
    const shp = this.shipments.find((s) => s.id === shipmentId);
    if (!shp) return;

    shp.status = 'received';
    shp.receivedAt = new Date().toISOString();
    shp.steps.push({
      status: 'received',
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: 'PHC Pharmacist',
      actorRoleMr: 'औषध निर्माता',
      timestamp: new Date().toISOString(),
      note: 'Verified physical parcel and added to PHC stock.',
      noteMr: 'प्रत्यक्ष पार्सल तपासले आणि साठ्यात जोडले.',
    });

    // Update PHC inventory item
    const invItem = this.inventory.find(
      (i) => i.phcId === shp.phcId && i.medicineId === shp.medicineId
    );

    let prevStock = 0;
    let newStock = 0;

    if (invItem) {
      prevStock = invItem.currentStock;
      invItem.currentStock += shp.quantity; // 84 + 200 = 284!
      newStock = invItem.currentStock;
      invItem.status = invItem.currentStock >= invItem.reorderPoint ? 'available' : 'low';
      invItem.updatedAt = new Date().toISOString();
    }

    // Update request status
    const req = this.requests.find((r) => r.id === shp.requestId);
    if (req) {
      req.status = 'received';
      req.updatedAt = new Date().toISOString();
    }

    this.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorId: this.currentProfile.userId,
      actorName: this.currentProfile.fullName,
      actorRole: this.currentProfile.role,
      actorRoleMr: 'औषध निर्माता',
      action: 'RECEIVE_SHIPMENT',
      entity: 'inventory',
      entityId: invItem?.id || shipmentId,
      previousValue: JSON.stringify({ currentStock: prevStock, status: 'low' }),
      newValue: JSON.stringify({ currentStock: newStock, status: invItem?.status, quantityAdded: shp.quantity }),
      createdAt: new Date().toISOString(),
    });

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'inventory',
      phcId: shp.phcId,
      phcName: shp.phcName,
      message: `Received ${shp.quantity} units of ${shp.medicineName}. Stock updated: ${prevStock} -> ${newStock} (${invItem?.status.toUpperCase()}).`,
      messageMr: `${shp.medicineNameMr} चे ${shp.quantity} युनिट्स प्राप्त झाले. साठा अपडेट: ${prevStock} -> ${newStock} (${invItem?.status === 'available' ? 'उपलब्ध' : 'कमी'}).`,
      createdAt: new Date().toISOString(),
    });

    this.notify(invItem?.id || shipmentId);
  }

  // RPC: book_appointment
  public book_appointment(
    phcId: string,
    date: string,
    time: string,
    careType: string,
    careTypeMr: string,
    patientId: string,
    patientName: string
  ): Appointment {
    const phc = this.phcs.find((p) => p.id === phcId) || this.phcs[0];
    const slot = this.appointmentSlots.find((s) => s.phcId === phcId && s.date === date && s.time === time);
    const tokenNo = slot ? slot.booked + 1 : Math.floor(Math.random() * 10) + 1;
    if (slot) {
      slot.booked += 1;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      phcId,
      phcName: phc.name,
      phcNameMr: phc.nameMr,
      patientId,
      patientName,
      tokenNo,
      date,
      time,
      careType,
      careTypeMr,
      status: 'booked',
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(newApt);

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'appointment',
      phcId,
      phcName: phc.name,
      message: `New appointment booked by ${patientName} (Token #${tokenNo}).`,
      messageMr: `${patientName} यांनी नवीन भेट निश्चित केली (टोकन #${tokenNo}).`,
      createdAt: new Date().toISOString(),
    });

    this.notify(newApt.id);
    return newApt;
  }

  // RPC: record_reading
  public record_reading(reading: Omit<HealthReading, 'id' | 'recordedAt'>): HealthReading {
    const newReading: HealthReading = {
      ...reading,
      id: `read-${Date.now()}`,
      recordedAt: new Date().toISOString(),
    };
    this.healthReadings.unshift(newReading);

    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      category: 'clinical',
      message: `Health reading recorded (${reading.type.toUpperCase()}) for patient ${reading.patientId}: ${reading.statusLabel}.`,
      messageMr: `रुग्ण ${reading.patientId} साठी आरोग्य वाचन नोंदवले (${reading.type.toUpperCase()}): ${reading.statusLabelMr}.`,
      createdAt: new Date().toISOString(),
    });

    this.notify(newReading.id);
    return newReading;
  }
}

export const store = new MediFlowStore();

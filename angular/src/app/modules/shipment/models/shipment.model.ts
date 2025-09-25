import { Box } from "./box.model";
import { ItemShipment } from "./item.model";
import { ShipmentStatus } from "./status.model";

export interface Shipment{
    id: string;
    lineLevel: string;
    storeCode: string;
    invoiceNumber: string;
    packingListNumber: string;
    deliveryFormNumber: string;
    shipmentDate: Date;
    status: ShipmentStatus;
    receiptDate?: Date;
    destockingNumber: string;
    filename: string;
    createdAt: Date;
    updatedAt: Date;

    statusLabel: string;
    items: ItemShipment[];
    boxs: Box[];
}
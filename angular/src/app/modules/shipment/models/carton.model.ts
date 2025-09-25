import { ItemShipment } from "./item.model";

export interface Carton {
    cartonNumber: string;
    items: ItemShipment[];
    nbItems: number;
    nbReceivedItems: number;
}
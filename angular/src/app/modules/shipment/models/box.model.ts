import { Carton } from "./carton.model";

export interface Box {
    boxNumber: string;
    cartons: Carton[];
    nbItems: number;
    nbReceivedItems: number;
}
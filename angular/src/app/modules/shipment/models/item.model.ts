export interface ItemShipment {
    id: string;
    lineLevel: string;
    boxNumber: string;
    cartonNumber: string;
    itemCode: string;
    eanCode: string;
    expectedQty: number;
    receivedQty: number;
    purchasePrice: number;
    purchasePriceCurrencyCode: string;
    tarifCode1: number;
    tarifCode2?: number;
    tarifCode3?: number;
    tarifCode4?: number;
    tarifCode5?: number;
    tarifCode6?: number;
    tarifCode7?: number;
    tarifCode8?: number;
    tarifCode9?: number;
    countryOriginCode: string;
    createdAt: Date;
    updatedAt: Date;
    idShipment: string;
}
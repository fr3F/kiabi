import { StatusFlag } from "../data";

export interface Catalog{
    id: string;
    statusFlag: StatusFlag;
    styleCode: string;
    theme: string;
    collection: string;
    collectionDescription: string;
    countryOriginCode: string;
    itemCode: string;
    eanCode: string;
    color: string;
    colorDescription: string;
    colorBasicDescription: string;
    size: string;
    sizeDescription: string;
    categoryCode: string;
    categoryDescription: string;
    storyCode: string;
    storyDescription: string;
    productTypeCode: string;
    productTypeDescription: string;
    initSellingPrice: number;
    currency: string;
    gammeTailleMin: string;
    gammeTailleMax: string;
    detailedProductDescription: string;
    createdAt: Date;
    updatedAt: Date;
}
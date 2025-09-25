export interface Historique{
    id: number;
    description?: string;
    idUser?: number;
    createdAt: Date;
    updatedAt: Date;
    user: any;
}
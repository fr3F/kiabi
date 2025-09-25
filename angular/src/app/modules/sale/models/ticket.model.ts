export interface Ticket{
    idticket: string;
    datecreation: string;
    nocaisse: string;
    namecaissier: string;
    nbarticle: number;
    montantht: number;
    montanttotal: number;
    montanttva: number;
    modepaiement: string;
    codeclient: string;
    recu: number;
    arendre: number;
    magasin: string;
    numticket: string;
    montantremise: number;
    numerocheque: string;
    isclos: number;
    codejournal: string;
    nomodereglement: string;
    depot: string;
    numeroFacture: string;
    ventedepot: boolean;
    clientvip: string;
    hash: string;
    duration: number;
    storeCode: string;
    createdAt: Date;
    updatedAt: Date;
    idEncaissement: number;

    articles?: any[];
    reglements?: any[];
    loyalty?: any;
}
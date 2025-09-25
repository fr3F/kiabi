// Table data
export class CategorieList {
    id: number;
    name: string;
    description?: string;
    level?: number;
    image?: string;
    parentId?: number;
    nb_produit: number;
}
  

// Search Data
export interface SearchResult {
    tables: CategorieList[];
    total: number;
}

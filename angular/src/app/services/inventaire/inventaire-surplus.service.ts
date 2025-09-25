import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SurplusArticle {
  idinventaire: number;
  eanCode: string;
  color: string;
  size: string;
  styleCode: string;
  designation: string;
  datasnapshot: string | null;
  snapshot_stock: number;
  counted_qty: number;
  datemodification?: string | null;
  surplus: number;
}

export interface IntrouvableArticle {
  idinventaire?: number;
  eanCode: string;
  color: string;
  size: string;
  styleCode: string;
  designation: string;
  stock: number;           // Stock théorique
  inventaire: number;      // Compté
  introuvable?: number;    // Quantité introuvable
  datasnapshot?: string | null;
  datemodification?: string | null;
  counted_qty:number
}


export interface SurplusResponse {
  totalAbsent?: number;
  totalOverstock?: number;
  totalStatus?: number;
  rows: SurplusArticle[];
}

@Injectable({
  providedIn: 'root',
})
export class InventaireSurplusService {
  // ⚡ Indiquer le protocole http:// devant l’IP
  private apiUrl = 'http://192.168.2.41:8104/api/inventaire';

  constructor(private http: HttpClient) {}

  // Articles absents
  getAbsentSnapshot(idinventaire: number): Observable<SurplusResponse> {
    return this.http.get<SurplusResponse>(`${this.apiUrl}/absent-snapshot/${idinventaire}`);
  }

  // Articles comptés supérieurs au stock snapshot
  getOverStock(idinventaire: number): Observable<SurplusArticle[]> {
    return this.http.get<SurplusArticle[]>(`${this.apiUrl}/overstock/${idinventaire}`);
  }

  // ⚡ Articles avec surplus négatif
  getSurplusNegatif(idinventaire: number): Observable<SurplusArticle[]> {
    return this.http.get<{ success: boolean; data: SurplusArticle[] }>(
      `${this.apiUrl}/surplus-negatif/${idinventaire}`
    ).pipe(
      map(res => res.data || [])
    );
  }
getIntrouvables(idinventaire: number): Observable<IntrouvableArticle[]> {
  if (!idinventaire) throw new Error("⚠️ idinventaire est obligatoire");

  return this.http.get<{ success: boolean; data: IntrouvableArticle | IntrouvableArticle[] }>(
    `${this.apiUrl}/introuvables/${idinventaire}`
  ).pipe(
    map(res => {
      if (!res.success || !res.data) return [];
      // Si data est un objet unique, le transformer en tableau
      return Array.isArray(res.data) ? res.data : [res.data];
    })
  );
}

}

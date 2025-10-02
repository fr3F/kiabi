import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';



export interface SurplusResponse {
  totalAbsent?: number;
  totalOverstock?: number;
  totalStatus?: number;
}

@Injectable({
  providedIn: 'root',
})
export class InventaireSurplusService {

  apiBaseUrl = environment.apiUrl
  private apiUrl = `${this.apiBaseUrl}/inventaire`;

  constructor(private http: HttpClient) { }

  // Articles avec surplus négatif
  getSurplus(idinventaire: number, page: number = 1, limit: number = 20) {
    return this.http
      .get<{ success: boolean; data: any[]; total: number }>(
        `${this.apiUrl}/surplus/${idinventaire}?page=${page}&limit=${limit}`
      )
      .pipe(map(res => res || { data: [], total: 0 }));
  }


  getIntrouvables(idinventaire){
    if (!idinventaire) throw new Error("idinventaire est obligatoire");

    return this.http.get<{ success: boolean; data }>(
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

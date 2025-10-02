import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";



@Injectable({ providedIn: "root" })
export class InventaireService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInventaireDetails(
    idinventaire,
    page = 1,
    limit = 50,
    search: string = ""
  ): Observable<{ data; total }> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString())
      .set("search", search);

    return this.http.get<{ data; total }>(
      `${this.baseUrl}/inventaire/${idinventaire}/detail`,
      { params }
    );
  }

  getProgress(idinventaire) {
    return this.http.get(`${this.baseUrl}/inventaire/${idinventaire}/progress`);
  }

  exportInventaireExcel(idinventaire): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/inventaire/${idinventaire}/export-excel`, {
      responseType: "blob",
    });
  }

  getInventaires(){
    return this.http.get(`${this.baseUrl}/inventaire`);
  }

  getInventaireById(idinventaire) {
    return this.http.get(`${this.baseUrl}/inventaire/${idinventaire}`);
  }

  createInventaire(data) {
    return this.http.post(`${this.baseUrl}/inventaire`, data);
  }

  updateInventaire(idinventaire, data) {
    return this.http.put(`${this.baseUrl}/inventaire/${idinventaire}`, data);
  }

  deleteInventaire(idinventaire){
    return this.http.delete(`${this.baseUrl}/inventaire/${idinventaire}`);
  }

  createSnapshot(idinventaire) {
    return this.http.post(`${this.baseUrl}/inventaire-snapshot`, { idinventaire });
  }
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { io, Socket } from "socket.io-client";
import { IntrouvableArticle, SurplusArticle } from "./inventaire-surplus.service";
import { environment } from "src/environments/environment";


export interface InventaireDetail {
  id: number;
  eanCode: string;
  color: string;
  size: string;
  styleCode: string;
  designation: string;
  datasnapshot?: string | null;
  stock: number;
  count: number;
  introuvable?: number;       // ⚡ nouveau champ
  datesnapshot?: string | null;
  datemodif?: string | null;
  counted_qty?: number,
  date_modif?: string | null; // 🔹 accepte ISO string ou null
}


export interface Inventaire {
  idinventaire: number;
  datedebut: string;
  datefin: string | null;
  status: string;
}

export interface OverStockData {
  rows: SurplusArticle[];
  total_count: number;
}

export interface IntrouvableData {
  rows: IntrouvableArticle[];
  total_introvable: number;
}

@Injectable({ providedIn: "root" })
export class InventaireService {
  api = environment.apiUrl
  private baseUrl = environment.apiUrl;
  private socketUrl = "http://192.168.88.250:8104";
  private socket: Socket;

  private progressSubject = new Subject<any>();
  private countSubject = new Subject<any>();
  private dataSubject = new Subject<InventaireDetail[]>();
  private overStockSubject = new Subject<OverStockData>();
  private introuvableSubject = new Subject<IntrouvableData>();

  constructor(private http: HttpClient) {
    this.socket = io(this.socketUrl);

    // Écoute globale des événements
    this.socket.on("inventaireProgressUpdate", (data) => this.progressSubject.next(data));

    this.socket.on("inventaireCountUpdate", (data) => this.countSubject.next(data));
    this.socket.on("inventaireData", (data: InventaireDetail[]) => this.dataSubject.next(data));

    this.socket.on("overStockData", (data: OverStockData) => {
      this.overStockSubject.next(data ?? { rows: [], total_count: 0 });
    });

    this.socket.on("getIntrouvable", (data: IntrouvableData) => {
      this.introuvableSubject.next(data ?? { rows: [], total_introvable: 0 });
    });
    this.socket.on("inventraireIntrouvable", (data) => this.countSubject.next(data));


  }

  // --- Sockets ---

  onCountIntrouvable(): Observable<any> {
    return this.countSubject.asObservable();
  }

  joinInventaire(idinventaire: number) {
    this.socket.emit("joinInventaire", idinventaire);
  }

  leaveInventaire(idinventaire: number) {
    this.socket.emit("leaveInventaire", idinventaire);
  }

  onInventaireProgressUpdate(): Observable<any> {
    return this.progressSubject.asObservable();
  }

  onInventaireCountUpdate(): Observable<any> {
    return this.countSubject.asObservable();
  }

  onInventaireData(): Observable<InventaireDetail[]> {
    return this.dataSubject.asObservable();
  }

  onOverStock(): Observable<OverStockData> {
    return this.overStockSubject.asObservable();
  }

  onAbsentSnapshot(): Observable<IntrouvableData> {
    return this.introuvableSubject.asObservable();
  }

  // --- REST API ---
  getInventaireDetails(
    idinventaire: number,
    page: number = 1,
    limit: number = 20,
    search: string = ""
  ): Observable<{ data: InventaireDetail[]; total: number }> {
    const params = new HttpParams()
      .set("page", page.toString())
      .set("limit", limit.toString())
      .set("search", search);

    return this.http.get<{ data: InventaireDetail[]; total: number }>(
      `${this.baseUrl}/inventaire/${idinventaire}/detail`,
      { params }
    );
  }

  getProgress(idinventaire: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventaire/${idinventaire}/progress`);
  }

  exportInventaireExcel(idinventaire: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/inventaire/${idinventaire}/export-excel`, {
      responseType: "blob"
    });
  }

  getInventaires(): Observable<Inventaire[]> {
    return this.http.get<Inventaire[]>(`${this.baseUrl}/inventaire`);
  }

  getInventaireById(idinventaire: number): Observable<Inventaire> {
    return this.http.get<Inventaire>(`${this.baseUrl}/inventaire/${idinventaire}`);
  }

  createInventaire(data: Partial<Inventaire>): Observable<Inventaire> {
    return this.http.post<Inventaire>(`${this.baseUrl}/inventaire`, data);
  }

  updateInventaire(idinventaire: number, data: Partial<Inventaire>): Observable<Inventaire> {
    return this.http.put<Inventaire>(`${this.baseUrl}/inventaire/${idinventaire}`, data);
  }

  deleteInventaire(idinventaire: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inventaire/${idinventaire}`);
  }
}

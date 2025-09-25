import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";

interface Inventaire {
  idinventaire: number;
  datedebut: string;
  datefin: string | null;
  status: string;
}

interface InventaireDetail {
  eanCode: string;
  color: string;
  size: string;
  styleCode: string;
  designation: string;
  datesnapshot: string;
  stock: number;
  count: number | null;
  datemodif: string | null;
}

@Component({
  selector: "app-liste-inventaire",
  templateUrl: "./liste-inventaire.component.html",
  styleUrls: ["./liste-inventaire.component.scss"],
})
export class ListeInventaireComponent implements OnInit, OnDestroy {
  inventaires: Inventaire[] = [];
  selectedInventaireDetails: InventaireDetail[] = [];
  loading = false;
  error = "";
  refreshInterval: any;

  selectedInventaireId: number | null = null;

  // Pagination & recherche détails
  detailsPage = 1;
  detailsLimit = 10;
  totalDetails = 0;
  searchDetails = "";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventaires();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadInventaires() {
    this.loading = true;
    this.http.get<Inventaire[]>("http://192.168.2.41:8104/api/inventaire")
      .subscribe({
        next: (data) => {
          this.inventaires = data;
          this.loading = false;
        },
        error: () => {
          this.error = "Erreur lors du chargement des inventaires";
          this.loading = false;
        }
      });
  }

  createSnapshot(idinventaire: number) {
  if (!idinventaire) return;

  this.loading = true;
  this.http.post("http://192.168.2.41:8104/api/inventaire-snapshot", { idinventaire })
    .subscribe({
      next: () => {
        this.loading = false;
        alert("Snapshot créé avec succès !");
        // Optionnel : recharger les détails après création
        if (this.selectedInventaireId === idinventaire) {
          this.loadDetails();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = "Erreur lors de la création du snapshot";
        console.error(err);
      }
    });
}

  viewDetails(idinventaire: number) {
    this.selectedInventaireId = idinventaire;
    this.detailsPage = 1;
    this.selectedInventaireDetails = [];
    this.loadDetails();

    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => this.loadDetails(), 2000);
  }

  private loadDetails() {
    if (!this.selectedInventaireId) return;

    const params = {
      page: this.detailsPage,
      limit: this.detailsLimit,
      search: this.searchDetails
    };

    this.http.get<{ data: InventaireDetail[], total: number }>(
      `http://192.168.2.41:8104/api/inventaire/${this.selectedInventaireId}/detail`,
      { params }
    ).subscribe({
      next: (res: any) => {
        this.selectedInventaireDetails = res.data || res;
        this.totalDetails = res.total || this.selectedInventaireDetails.length;
        this.loading = false;
      },
      error: () => {
        this.error = "Erreur lors du chargement des détails";
        this.loading = false;
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.totalDetails / this.detailsLimit);
  }

  changePageDetails(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.detailsPage = page;
    this.loadDetails();
  }

  searchDetailsInventaire() {
    this.detailsPage = 1;
    this.loadDetails();
  }

  exportExcelDetails() {
    if (!this.selectedInventaireId) return;

    const url = `http://192.168.2.41:8104/api/inventaire/${this.selectedInventaireId}/export-excel`;
    this.http.get(url, { responseType: "blob" }).subscribe({
      next: (blob) => {
        const a = document.createElement("a");
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = `inventaire_${this.selectedInventaireId}.xlsx`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      },
      error: () => {
        this.error = "Erreur lors de l’export Excel";
      }
    });
  }
}

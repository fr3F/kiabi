import { HttpClient } from "@angular/common/http";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { InventaireService } from "src/app/services/inventaire/inventaire.service";

interface Inventaire {
  idinventaire: number;
  datedebut: string;
  datefin: string | null;
  status: string;
}

@Component({
  selector: "app-liste-inventaire",
  templateUrl: "./liste-inventaire.component.html",
  styleUrls: ["./liste-inventaire.component.scss"],
})
export class ListeInventaireComponent implements OnInit, OnDestroy {
  inventaires;
  selectedInventaireDetails;
  loading = false;
  error = "";
  refreshInterval: any;

  selectedInventaireId: number | null = null;

  // Pagination & recherche détails
  detailsPage = 1;
  detailsLimit = 10;
  totalDetails = 0;
  searchDetails = "";

  constructor(
    private http: HttpClient,  
    private inventaireService: InventaireService
  ) {}

  ngOnInit(): void {
    this.loadInventaires();
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  loadInventaires() {
    this.loading = true;
      this.inventaireService.getInventaires()
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
  this.inventaireService.createSnapshot(idinventaire)
    .subscribe({
      next: () => {
        this.loading = false;
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
    this.loading = true;
    this.error = null;

    this.inventaireService
      .getInventaireDetails(this.selectedInventaireId, this.detailsPage, this.detailsLimit, this.searchDetails)
      .subscribe({
        next: (res) => {
          this.selectedInventaireDetails = res.data;
          this.totalDetails = res.total;
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

    this.inventaireService.exportInventaireExcel(this.selectedInventaireId)
      .subscribe({
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
      })
  }
}

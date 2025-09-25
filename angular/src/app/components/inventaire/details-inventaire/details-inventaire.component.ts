import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ApexOptions } from "ng-apexcharts";

import { InventaireDetail, InventaireService } from "src/app/services/inventaire/inventaire.service";
import { NotificationService } from "src/app/services/notification/notification.service";
import { getRadialBarChartOptions } from "src/app/pages/inventaire/utils/chart-config";
import { IntrouvableArticle, SurplusArticle } from "src/app/services/inventaire/inventaire-surplus.service";

@Component({
  selector: "app-details-inventaire",
  templateUrl: "./details-inventaire.component.html",
  styleUrls: ["./details-inventaire.component.scss"],
})
export class DetailsInventaireComponent implements OnInit, OnDestroy {
  @Input() idinventaire!: number;

  details: InventaireDetail[] = [];
  progressData = { totalStock: 0, totalCount: 0, progress: 0 };
  searchDetails = '';
  currentPage = 1;
  itemsPerPage = 10;
  chartOptions: Partial<ApexOptions> = getRadialBarChartOptions(0);

  private subscriptions: any[] = [];
  private currentRoomId: number | null = null;
  private searchTimeout: any;

  constructor(
    private service: InventaireService,
    private notif: NotificationService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.spinner.show();

    const routeSub = this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (!id) return;

      const newId = +id;
      if (this.currentRoomId === newId) return;

      this.idinventaire = newId;

      if (this.currentRoomId) this.service.leaveInventaire(this.currentRoomId);
      this.currentRoomId = this.idinventaire;

      this.details = [];
      this.currentPage = 1;

      this.subscriptions.forEach((s) => s.unsubscribe());
      this.subscriptions = [];

      this.service.joinInventaire(this.idinventaire);

      this.subscriptions.push(
        this.service.onInventaireData().subscribe((data) => this.setDetails(data)),
        this.service.onInventaireCountUpdate().subscribe((data) => this.updateCounts(data)),
        this.service.onInventaireProgressUpdate().subscribe((progress) => this.setProgress(progress))
      );

      this.loadDetails();
    });

    this.subscriptions.push(routeSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
    if (this.currentRoomId) this.service.leaveInventaire(this.currentRoomId);
  }

  loadDetails() {
    if (!this.idinventaire) return;

    this.service.getInventaireDetails(this.idinventaire, 1, 9999, this.searchDetails).subscribe({
      next: (res) => {
        console.log("Détails reçus:", res);

        this.details = res.data.map(d => ({
          ...d,
          stock: Number(d.stock ?? 0),

          count: Number(d.counted_qty ?? 0),
          introuvable: Number(d.introuvable ?? 0)
        }));
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.notif.error("Erreur lors du chargement des détails");
      },
    });
  }

  private setDetails(data: InventaireDetail[]) {
    this.details = data.map(d => ({
      ...d,
      stock: Number(d.stock ?? 0),
      count: Number(d.count ?? 0),
      introuvable: Number(d.introuvable ?? 0)
    }));
  }

  private updateCounts(data: InventaireDetail[]) {
    this.details = this.details.map(d => {
      const updated = data.find(r => r.eanCode === d.eanCode);
      return updated ? { ...d, ...updated, stock: Number(updated.stock ?? 0), count: Number(updated.count ?? 0) } : d;
    });
  }

  private setProgress(progress: { totalStock: number; totalCount: number; totalSurplus: number; progress: number }) {
    this.progressData = progress;
    this.chartOptions = getRadialBarChartOptions(progress.progress);
  }

  onSearchChange(value: string) {
    this.searchDetails = value;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadDetails();
    }, 300);
  }

  exportExcel() {
    if (!this.idinventaire) return;

    this.spinner.show();
    this.service.exportInventaireExcel(this.idinventaire).subscribe({
      next: (blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `inventaire_${this.idinventaire}.xlsx`;
        a.click();
        URL.revokeObjectURL(a.href);
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.notif.error("Erreur lors de l’export Excel");
      },
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.details.length / this.itemsPerPage);
  }

  onSurplusClick(data: SurplusArticle[]) {
    this.details = data.map(d => ({
      id: d.idinventaire,
      eanCode: d.eanCode,
      color: d.color,
      size: d.size,
      styleCode: d.styleCode,
      designation: d.designation,
      datasnapshot: d.datasnapshot,
      stock: Number(d.snapshot_stock ?? 0),
      count: Number(d.counted_qty ?? 0),
      datemodif: d.datemodification,
      introuvable: 0
    }));
    this.currentPage = 1;
  }

  onIntrouvablesClick(data: IntrouvableArticle[]) {
    if (!data || !data.length) {
      this.details = [];
      this.currentPage = 1;
      return;
    }
    this.details = data.map(d => ({
      id: d.idinventaire,
      eanCode: d.eanCode,
      color: d.color,
      size: d.size,
      styleCode: d.styleCode,
      designation: d.designation,
      stock: Number(d.stock ?? 0),
      count: Number(d.counted_qty ?? 0), // copier counted_qty ici
      introuvable: Number(d.introuvable ?? 0),
      datasnapshot: d.datasnapshot,
      datemodif: d.datemodification
    }));
    this.currentPage = 1;
  }

  showAll() {
    if (!this.idinventaire) return;

    this.service.getInventaireDetails(this.idinventaire, 1, 9999, '').subscribe({
      next: (res) => {
        this.details = res.data.map(d => ({
          ...d,
          stock: Number(d.stock ?? 0),
          count: Number(d.count ?? 0),
          introuvable: Number(d.introuvable ?? 0)
        }));
        this.currentPage = 1;
      },
      error: () => this.notif.error("Erreur lors du chargement de tous les détails")
    });
  }
}

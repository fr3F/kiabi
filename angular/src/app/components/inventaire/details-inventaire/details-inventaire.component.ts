import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ApexOptions } from "ng-apexcharts";
import { Subscription, Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { InventaireService } from "src/app/services/inventaire/inventaire.service";
import { NotificationService } from "src/app/services/notification/notification.service";
import { getRadialBarChartOptions } from "src/app/pages/inventaire/utils/chart-config";
import { BaseService } from "src/app/services/base/base.service";
import { MenuService } from "src/app/services/acces/menu.service";
import { InventaireSocketService } from "src/app/services/inventaire/inventaire-socket.service";
import { BaseListPageComponent } from "src/app/pages/base/base-list-page/base-list-page.component";

@Component({
  selector: "app-details-inventaire",
  templateUrl: "./details-inventaire.component.html",
  styleUrls: ["./details-inventaire.component.scss"],
})
export class DetailsInventaireComponent extends BaseListPageComponent implements OnInit, OnDestroy {
  @Input() idinventaire!: number;

  details = [];
  allDetails = [];
  summaryData;
  searchDetails = "";
  totalItems = 0;
  chartOptions: Partial<ApexOptions> = getRadialBarChartOptions(0);
  isShow:boolean = true
  private subscriptions: Subscription[] = [];
  private currentRoomId: number | null = null;
  private searchSubject = new Subject<string>();

  constructor(
    private service: InventaireService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: BaseService,
    private inventaireSocket: InventaireSocketService
  ) {
    super(notif, serv, baseServ);
  }

  ngOnInit() {
    this.spinner.show();
    this.subscribeToRoute();
    this.initSearchDebounce();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
    this.leaveCurrentRoom();
  }

  // --------------------- ROUTE ---------------------
  private subscribeToRoute() {
    const sub = this.route.paramMap.subscribe(params => {
      const id = +params.get("id")!;
      if (!id || this.currentRoomId === id) return;

      this.idinventaire = id;
      this.leaveCurrentRoom();
      this.currentRoomId = id;

      this.resetData();
      this.joinCurrentRoom();
      this.loadInventaireDetails();
    });
    this.addSubscription(sub);
  }

  private resetData() {
    this.details = [];
    this.allDetails = [];
    this.page = 1;
    this.unsubscribeAll();
  }

  // --------------------- SUBSCRIPTIONS ---------------------
  private addSubscription(sub: Subscription) {
    this.subscriptions.push(sub);
  }

  private unsubscribeAll() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.subscriptions = [];
  }

  // --------------------- SOCKET ---------------------
  private joinCurrentRoom() {
    if (!this.idinventaire) return;
    this.inventaireSocket.joinInventaire(this.idinventaire);
    this.addSubscription(
      this.inventaireSocket.onInventaireData().subscribe(data => this.setDetails(data))
    );
    this.addSubscription(
      this.inventaireSocket.onInventaireSummary().subscribe(summary => this.setSummary(summary))
    );
  }

  private leaveCurrentRoom() {
    if (this.currentRoomId) this.inventaireSocket.leaveInventaire(this.currentRoomId);
  }

  // --------------------- DATA TRANSFORMATION ---------------------
  private transformDetail(detail) {
    return {
      ...detail,
      stock: Number(detail.stock),
      count: Number(detail.counted_qty),
      introuvable: Number(detail.introuvable),
      date_modif: detail.date_modif ? new Date(detail.date_modif).toISOString() : null,
      datasnapshot: detail.datasnapshot ?? null
    };
  }

  private setDetails(data) {
    this.details = data.map(this.transformDetail);
  }

  private setSummary(summary) {
    this.summaryData = summary;
    this.chartOptions = getRadialBarChartOptions(summary.progress);
  }

  private setTotalItems(total: number) {
    this.totalItems = total;
  }

  // --------------------- LOAD INVENTAIRE ---------------------
  loadInventaireDetails() {
    if (!this.idinventaire) return;

    this.fetchDetails()
      .then(res => {
        this.setDetails(res.data);
        this.setTotalItems(res.total);
        this.correctPageIfNeeded();
        this.spinner.hide();
      })
      .catch(() => {
        this.spinner.hide();
        this.notif.error("Erreur lors du chargement des détails");
      });
  }

  private fetchDetails() {
    return this.service
      .getInventaireDetails(this.idinventaire, this.page, this.pageSize, this.searchDetails)
      .toPromise();
  }

  private correctPageIfNeeded() {
    const totalPages = this.getTotalPages();
    if (this.page > totalPages && totalPages > 0) {
      this.page = totalPages;
      this.loadInventaireDetails();
    }
  }

  // --------------------- SEARCH ---------------------
  private initSearchDebounce() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.page = 1;
      this.loadInventaireDetails();
    });
  }

  onSearchChange(value) {
    this.searchDetails = value;
    this.searchSubject.next(value);
  }

  // --------------------- EXPORT ---------------------
  exportExcel() {
    if (!this.idinventaire) return;
    this.spinner.show();

    this.service.exportInventaireExcel(this.idinventaire).subscribe({
      next: blob => {
        this.downloadFile(blob, `inventaire_${this.idinventaire}.xlsx`);
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.notif.error("Erreur lors de l’export Excel");
      }
    });
  }

  private downloadFile(blob: Blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // --------------------- PAGINATION ---------------------
  getTotalPages() {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  changePage(page: number) {
    if (page < 1 || page > this.getTotalPages()) return;
    this.page = page;
    this.allDetails.length ? this.updatePageDetails() : this.loadInventaireDetails();
  }

  private updatePageDetails() {
    const start = (this.page - 1) * this.pageSize;
    this.details = this.allDetails.slice(start, start + this.pageSize);
  }

  // --------------------- SURPLUS / INTROUVABLES ---------------------
  private mapAllDetails(data, isIntrouvable = false) {
    return (data).map(d => ({
      ...this.transformDetail(d),
      introuvable: isIntrouvable ? Number(d.introuvable) : 0
    }));
  }

  onSurplusClick(data) {
    this.allDetails = this.mapAllDetails(data, false);
    this.resetPagination();
    this.isShow = false
  }

  onIntrouvablesClick(data) {
    this.allDetails = this.mapAllDetails(data, true);
    this.resetPagination();
    this.isShow = false
  }

  private resetPagination() {
    this.page = 1;
    this.totalItems = this.allDetails.length;
    this.updatePageDetails();
  }

  // --------------------- SHOW ALL ---------------------
  showAll() {
    this.spinner.show();
    this.isShow = true;
    this.searchDetails = "";
    this.page = 1;
    this.loadInventaireDetails();
  }
}

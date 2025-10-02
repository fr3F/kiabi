import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import { Subscription } from "rxjs";
import { InventaireSocketService, InventaireSummary } from "src/app/services/inventaire/inventaire-socket.service";
import {
  InventaireSurplusService
} from "src/app/services/inventaire/inventaire-surplus.service";

@Component({
  selector: "app-surplus",
  templateUrl: "./surplus.component.html",
  styleUrls: ["./surplus.component.scss"]
})
export class SurplusComponent implements OnInit, OnDestroy, OnChanges {
  @Input() idinventaire!: number;
  @Output() surplusClick = new EventEmitter;
  @Output() introuvablesClick = new EventEmitter;

  absentSnapshot;
  overStock

  totalAbsent = 0;
  totalOverStock = 0;
  totalSurplusNonExistant = 0;
  totalSurplusTotal = 0;
  progress = 0;


  currentPage = 1;
  pageSize = 20;
  totalItems = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private surplusService: InventaireSurplusService,
    private inventaireSocket: InventaireSocketService
  ) {}

  ngOnInit() {
    if (this.idinventaire) this.initInventaire();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["idinventaire"] && this.idinventaire) {
      this.cleanupInventaire();
      this.initInventaire();
    }
  }

  ngOnDestroy() {
    this.cleanupInventaire();
  }

  private initInventaire() {
    this.inventaireSocket.joinInventaire(this.idinventaire);

    this.subscriptions.push(
      this.inventaireSocket.onInventaireSummary().subscribe((summary: InventaireSummary) => {
        
        if (!summary) return;

        // Totaux
        this.totalAbsent = summary.introuvable;
        this.totalOverStock = summary.surplus;
        this.totalSurplusNonExistant = summary.surplusnonExistant;
        this.totalSurplusTotal = summary.surplusTotal;
        this.progress = summary.progress;

        this.absentSnapshot = [];
        this.overStock = [];
      })
    );
  }

  private cleanupInventaire() {
    if (this.idinventaire) this.inventaireSocket.leaveInventaire(this.idinventaire);
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  showOverStock(page: number = 1) {
    this.currentPage = page;
    this.surplusService.getSurplus(this.idinventaire, page, this.pageSize).subscribe({
      next: (res) => {
        this.overStock = (res.data || []).map((d) => ({
          ...d,
          date_modif: d.date_modif ? new Date(d.date_modif).toISOString() : null,
        }));
        this.totalItems = res.total;
        this.surplusClick.emit(this.overStock);
      },
      error: (err) => console.error("Erreur Surplus :", err),
    });
  }

  showIntrouvables() {
    if (!this.idinventaire) return;

    this.surplusService.getIntrouvables(this.idinventaire).subscribe({
      next: (data) => {
        this.absentSnapshot = (data || []).map((d) => ({
          ...d,
          count: Number(d.counted_qty ?? 0),
          date_modif: d.date_modif ? new Date(d.date_modif).toISOString() : null
        }));
        this.introuvablesClick.emit(this.absentSnapshot);
      },
      error: (err) => console.error("Erreur Introuvables :", err)
    });
  }
}


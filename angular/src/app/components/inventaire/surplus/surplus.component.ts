import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { IntrouvableArticle, SurplusArticle, InventaireSurplusService } from "src/app/services/inventaire/inventaire-surplus.service";
import { InventaireService } from "src/app/services/inventaire/inventaire.service";

@Component({
  selector: "app-surplus",
  templateUrl: "./surplus.component.html",
  styleUrls: ["./surplus.component.scss"]
})
export class SurplusComponent implements OnInit, OnDestroy, OnChanges {
  @Input() idinventaire!: number;
  @Output() surplusClick = new EventEmitter<SurplusArticle[]>();
  @Output() introuvablesClick = new EventEmitter<IntrouvableArticle[]>();

  absentSnapshot: IntrouvableArticle[] = [];
  overStock: SurplusArticle[] = [];
  totalOverStock = 0;
  totalAbsent = 0;

  private subscriptions: Subscription[] = [];

  constructor(
    private surplusService: InventaireSurplusService,
    private inventaireService: InventaireService
  ) { }

  ngOnInit(): void {
    if (this.idinventaire) this.initInventaire();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idinventaire'] && this.idinventaire) {
      this.cleanupInventaire();
      this.initInventaire();
    }
  }

  ngOnDestroy(): void {
    this.cleanupInventaire();
  }

  private initInventaire(): void {
    this.inventaireService.joinInventaire(this.idinventaire);

    this.subscriptions.push(
      this.inventaireService.onAbsentSnapshot().subscribe(data => {
        this.absentSnapshot = data.rows || [];
        this.totalAbsent = Number(data.total_introvable || 0);
      }),
      this.inventaireService.onOverStock().subscribe(data => {
        this.overStock = data.rows || [];
        this.totalOverStock = Number(data.total_count || 0);
      })
    );
  }

  private cleanupInventaire(): void {
    if (this.idinventaire) this.inventaireService.leaveInventaire(this.idinventaire);
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }

  showOverStock(): void {
    this.surplusService.getSurplusNegatif(this.idinventaire).subscribe({
      next: (data: SurplusArticle[]) => {
        this.overStock = (data || []).map(d => ({
          ...d,
          date_modif: d.date_modif ? new Date(d.date_modif).toISOString() : null
        }));
        this.surplusClick.emit(this.overStock);
      },
      error: err => console.error("Erreur Surplus :", err)
    });
  }


  showIntrouvables(): void {
    if (!this.idinventaire) return;

    this.surplusService.getIntrouvables(this.idinventaire).subscribe({
      next: (data: IntrouvableArticle[]) => {
        console.log("data idinventaire", data);
        this.absentSnapshot = (data || []).map(d => ({
          ...d,
          count: Number(d.counted_qty ?? 0),
          date_modif: d.date_modif ? new Date(d.date_modif).toISOString() : null

        }));
        this.introuvablesClick.emit(this.absentSnapshot);
      },
      error: err => console.error("Erreur Introuvables :", err)
    });
  }



}
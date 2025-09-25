import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from "@angular/core";
import { ApexOptions, ChartComponent } from "ng-apexcharts";
import { getRadialBarChartOptions } from "src/app/pages/inventaire/utils/chart-config";
import { InventaireService } from "src/app/services/inventaire/inventaire.service";
import { Subscription } from "rxjs";
import { IntrouvableArticle, SurplusArticle } from "src/app/services/inventaire/inventaire-surplus.service";

@Component({
  selector: 'app-inventaire-progress',
  templateUrl: './inventaire-progress.component.html',
  styleUrls: ['./inventaire-progress.component.scss']
})
export class InventaireProgressComponent implements OnInit, OnDestroy {
  @Input() idinventaire!: number;
  @Output() surplusClick = new EventEmitter<SurplusArticle[]>(); // 👈 ajout
  @Output() introuvablesClick = new EventEmitter<IntrouvableArticle[]>();

  progress: number = 0;
  chartOptions: Partial<ApexOptions> = getRadialBarChartOptions(0);

  private sub!: Subscription;

  @ViewChild("chart") chart!: ChartComponent;

  constructor(private service: InventaireService) {}

  ngOnInit() {
    if (!this.idinventaire) return;

    this.service.joinInventaire(this.idinventaire);

    this.sub = this.service.onInventaireProgressUpdate().subscribe((data) => {
      this.progress = data.progress || 0;
      if (this.chartOptions.series) {
        this.chartOptions.series = [this.progress];
      } else {
        this.chartOptions = getRadialBarChartOptions(this.progress);
      }
    });
  }

  ngOnDestroy() {
    this.service.leaveInventaire(this.idinventaire);
    this.sub?.unsubscribe();
  }

  // Quand Surplus envoie ses données
  handleSurplus(data: SurplusArticle[]) {
    this.surplusClick.emit(data); // 👈 renvoyer au parent
  }

    // ⚡ Méthode pour recevoir les introuvables de l'enfant <app-surplus>
  handleIntrouvables(data: IntrouvableArticle[]) {
    this.introuvablesClick.emit(data);
  }
}

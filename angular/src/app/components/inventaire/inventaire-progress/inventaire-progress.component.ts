import { Component, Input, OnInit, OnDestroy, ViewChild, Output, EventEmitter } from "@angular/core";
import { ApexOptions, ChartComponent } from "ng-apexcharts";
import { getRadialBarChartOptions } from "src/app/pages/inventaire/utils/chart-config";
import { InventaireService } from "src/app/services/inventaire/inventaire.service";
import { Subscription } from "rxjs";
import { InventaireSocketService, InventaireSummary } from "src/app/services/inventaire/inventaire-socket.service";

@Component({
  selector: "app-inventaire-progress",
  templateUrl: "./inventaire-progress.component.html",
  styleUrls: ["./inventaire-progress.component.scss"],
})
export class InventaireProgressComponent implements OnInit, OnDestroy {
  @Input() idinventaire!: number;
  @Output() surplusClick = new EventEmitter;
  @Output() introuvablesClick = new EventEmitter;
  @ViewChild("chart") chart!: ChartComponent;


  progress: number = 0;
  chartOptions: Partial<ApexOptions> = getRadialBarChartOptions(0);

  private sub!: Subscription;


  constructor(
    private inventaireSocket: InventaireSocketService
  ) {}

  ngOnInit() {
    if (!this.idinventaire) return;

    this.inventaireSocket.joinInventaire(this.idinventaire);
    this.sub = this.inventaireSocket.onInventaireSummary().subscribe((summary: InventaireSummary) => {
      if (!summary || !summary.progress) return;

      this.progress = summary.progress ?? 0;

      if (this.chartOptions.series) {
        this.chartOptions.series = [this.progress];
      } else {
        this.chartOptions = getRadialBarChartOptions(this.progress);
      }
    });
  }

  ngOnDestroy() {
    this.inventaireSocket.leaveInventaire(this.idinventaire);
    this.sub?.unsubscribe();
  }

  handleSurplus(data) {
    this.surplusClick.emit(data);
  }

  handleIntrouvables(data) {
    this.introuvablesClick.emit(data);
  }
}

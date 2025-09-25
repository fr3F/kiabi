import { Component, OnInit } from '@angular/core';
import { CarteVipService } from '../../../services/carte-vip.service';

@Component({
  selector: 'app-historiques-parametrage',
  templateUrl: './historiques-parametrage.component.html',
  styleUrls: ['./historiques-parametrage.component.scss']
})
export class HistoriquesParametrageComponent implements OnInit {

  historiques;

  POINT_MIN = "Point min";

  constructor(
    private carteVipService: CarteVipService
  ) { }

  ngOnInit(): void {
    this.subscribeRefresh();
    this.refreshHistoriques();
  }

  subscribeRefresh(){
    this.carteVipService.onRefreshHistoryParam.subscribe(
      (r)=> this.refreshHistoriques()
    )
  }

  refreshHistoriques(){
    this.carteVipService.getHistoriquesParam()
      .subscribe(
        (r)=> this.historiques = r,
        this.carteVipService.onError
      )
  }
}

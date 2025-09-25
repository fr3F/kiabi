import { Component, Input, OnInit } from '@angular/core';
import { CarteVipService } from 'src/app/modules/marketing/carte-vip/services/carte-vip.service';

@Component({
  selector: 'app-historique-conso',
  templateUrl: './historique-conso.component.html',
  styleUrls: ['./historique-conso.component.scss']
})
export class HistoriqueConsoComponent implements OnInit {

  @Input() numClient;
  historiques;

  constructor(
    private carteVipService: CarteVipService
  ) { }

  ngOnInit(): void {
    this.initializeHistoriques();
  }

  initializeHistoriques(){
    this.carteVipService.getHistoriquesConso(this.numClient).subscribe(
      (r)=> this.historiques = r,
      this.carteVipService.onError
    );
  }

  getEcart(item){
    return Math.abs(item.pointApres - item.pointAvant);
  }

  getSignEcart(item){
    if(item.pointApres > item.pointAvant)
      return "+"
    return "-";
  }

  getClassEcart(item){
    if(item.pointApres > item.pointAvant)
      return "bg-info";
    return "bg-danger"
  }

}

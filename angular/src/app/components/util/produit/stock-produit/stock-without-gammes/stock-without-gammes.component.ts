import { Component, OnInit } from '@angular/core';
import { StockWithGammesComponent } from '../stock-with-gammes/stock-with-gammes.component';

@Component({
  selector: 'app-stock-without-gammes',
  templateUrl: './stock-without-gammes.component.html',
  styleUrls: ['./stock-without-gammes.component.scss']
})
export class StockWithoutGammesComponent extends StockWithGammesComponent {


  getStockDepot(depot){
    return this.data.find((r)=> r.depot == depot).quantite;
  }
}

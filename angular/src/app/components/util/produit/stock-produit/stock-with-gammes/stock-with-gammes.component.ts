import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-with-gammes',
  templateUrl: './stock-with-gammes.component.html',
  styleUrls: ['./stock-with-gammes.component.scss']
})
export class StockWithGammesComponent implements OnInit {

  @Input() data;
  @Input() tableClass;
  @Input() depots;

  constructor() { }

  ngOnInit(): void {
  }

  getStocksDepot(depot){
    return this.data.filter((r)=> r.depot == depot)
  }
}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-autre-depots',
  templateUrl: './stock-autre-depots.component.html',
  styleUrls: ['./stock-autre-depots.component.scss']
})
export class StockAutreDepotsComponent implements OnInit {

  @Input() stocks: any[];
  
  constructor() { }

  ngOnInit(): void {
  }

}

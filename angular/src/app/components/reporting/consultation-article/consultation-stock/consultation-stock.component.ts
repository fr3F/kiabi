import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultation-stock',
  templateUrl: './consultation-stock.component.html',
  styleUrls: ['./consultation-stock.component.scss']
})
export class ConsultationStockComponent implements OnInit {

  @Input() data;
  @Input() magasin = false;
  constructor() { }

  ngOnInit(): void {
  }

}

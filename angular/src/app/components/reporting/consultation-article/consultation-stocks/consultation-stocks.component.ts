import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultation-stocks',
  templateUrl: './consultation-stocks.component.html',
  styleUrls: ['./consultation-stocks.component.scss']
})
export class ConsultationStocksComponent implements OnInit {

  constructor() { }
  @Input() data;

  ngOnInit(): void {
  }

}

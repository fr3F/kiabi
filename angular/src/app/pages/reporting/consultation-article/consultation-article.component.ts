import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consultation-article',
  templateUrl: './consultation-article.component.html',
  styleUrls: ['./consultation-article.component.scss']
})
export class ConsultationArticleComponent implements OnInit {

  data;
  dataStock;
  dataStockMagasin;
  allStocks;
  code;

  constructor() { }

  ngOnInit(): void {
  }

  setData(event){
    this.data = event;
  }

  setDataStock(event){
    this.dataStock = event;
  }

  setDataStockMagasin(event){
    this.dataStockMagasin = event;
  }
  
  setAllStocks(event){
    this.allStocks = event;
  }

  setCode(event){
    this.code = event;
  }

}

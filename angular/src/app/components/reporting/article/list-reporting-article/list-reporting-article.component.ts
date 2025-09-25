import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-reporting-article',
  templateUrl: './list-reporting-article.component.html',
  styleUrls: ['./list-reporting-article.component.scss']
})
export class ListReportingArticleComponent implements OnInit {

  @Input() list: any[];
  @Input() isBarcode: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  withError(item){
    return !item.designation;
  }

}

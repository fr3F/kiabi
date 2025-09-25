import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-offered-articles-list',
  templateUrl: './offered-articles-list.component.html',
  styleUrls: ['./offered-articles-list.component.scss']
})
export class OfferedArticlesListComponent implements OnInit {

  @Input() articles: any[];
  constructor() { }

  ngOnInit(): void {
  }

  delete(index: number){
    this.articles.splice(index, 1);
  }

}

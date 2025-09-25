import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-article-ticket-caisse',
  templateUrl: './table-article-ticket-caisse.component.html',
  styleUrls: ['./table-article-ticket-caisse.component.scss']
})
export class TableArticleTicketCaisseComponent implements OnInit {

  @Input() list;
  @Input() specificCode = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}

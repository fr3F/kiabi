import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-articles-ticket',
  templateUrl: './articles-ticket.component.html',
  styleUrls: ['./articles-ticket.component.scss']
})
export class ArticlesTicketComponent implements OnInit {
  @Input() list: any[];

  constructor(
  ) { }

  ngOnInit(): void {
  }

}

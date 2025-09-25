import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from 'src/app/modules/sale/models/ticket.model';

@Component({
  selector: 'app-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss']
})
export class InfoTicketComponent implements OnInit {

  @Input() ticket: Ticket;
  constructor() { }

  ngOnInit(): void {
  }

}

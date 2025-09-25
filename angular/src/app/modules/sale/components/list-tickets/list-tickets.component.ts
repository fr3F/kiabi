import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from '../../models/ticket.model';

@Component({
  selector: 'app-list-tickets',
  templateUrl: './list-tickets.component.html',
  styleUrls: ['./list-tickets.component.scss']
})
export class ListTicketsComponent implements OnInit {

  @Input() tickets: Ticket[];
  constructor() { }

  ngOnInit(): void {
  }

}

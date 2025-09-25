import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-reglements-ticket',
  templateUrl: './reglements-ticket.component.html',
  styleUrls: ['./reglements-ticket.component.scss']
})
export class ReglementsTicketComponent implements OnInit {
  @Input() list: any[];
  constructor() { }

  ngOnInit(): void {
  }

}

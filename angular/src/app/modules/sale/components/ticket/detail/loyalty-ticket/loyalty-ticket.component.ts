import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyalty-ticket',
  templateUrl: './loyalty-ticket.component.html',
  styleUrls: ['./loyalty-ticket.component.scss']
})
export class LoyaltyTicketComponent implements OnInit {

  @Input() loyalty;
  
  constructor() { }

  ngOnInit(): void {
  }

}

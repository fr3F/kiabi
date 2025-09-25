import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recap-reporting-ticket',
  templateUrl: './recap-reporting-ticket.component.html',
  styleUrls: ['./recap-reporting-ticket.component.scss']
})
export class RecapReportingTicketComponent implements OnInit {

  @Input() data;


  constructor(
  ) { }

  ngOnInit(): void {
  }

}

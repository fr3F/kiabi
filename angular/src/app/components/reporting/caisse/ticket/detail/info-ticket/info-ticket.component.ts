import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss']
})
export class InfoTicketComponent implements OnInit {

  @Input() ticket;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}

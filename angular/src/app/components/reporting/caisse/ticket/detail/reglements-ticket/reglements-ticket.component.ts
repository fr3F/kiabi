import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-reglements-ticket',
  templateUrl: './reglements-ticket.component.html',
  styleUrls: ['./reglements-ticket.component.scss']
})
export class ReglementsTicketComponent implements OnInit {
  @Input() list: any[];


  constructor(
  ) { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-detail-ticket-magasin',
  templateUrl: './detail-ticket-magasin.component.html',
  styleUrls: ['./detail-ticket-magasin.component.scss']
})
export class DetailTicketMagasinComponent implements OnInit {

  @Input() itemTickets
  total

  constructor(
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.total = 0;
    for(let item of this.itemTickets)
      this.total += parseFloat(item.prixtotal) 
  }

  
}

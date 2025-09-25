import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Ticket } from 'src/app/modules/sale/models/ticket.model';
import { SaleService } from 'src/app/modules/sale/services/sale.service';

@Component({
  selector: 'app-detail-ticket',
  templateUrl: './detail-ticket.component.html',
  styleUrls: ['./detail-ticket.component.scss']
})
export class DetailTicketComponent implements OnInit {

  @Input() idTicket;
  ticket: Ticket;

  constructor(
    private saleService: SaleService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initializeTicket();
  }

  initializeTicket(){
    this.spinner.show();
    this.saleService.findTicketById(this.idTicket).subscribe(
      (r)=> {
        this.ticket = r;
        this.spinner.hide();
      },
      this.saleService.onError
    )
  }
}

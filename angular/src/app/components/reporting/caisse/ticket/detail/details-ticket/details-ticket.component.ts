import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';

@Component({
  selector: 'app-details-ticket',
  templateUrl: './details-ticket.component.html',
  styleUrls: ['./details-ticket.component.scss']
})
export class DetailsTicketComponent implements OnInit {

  @Input() id;
  @Input() idCaisse;
  ticket;

  constructor(
    private caisseService: CaisseService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initializeTicket();
  }

  
  initializeTicket(){
    this.spinner.show();
    this.caisseService.findTicketById(this.idCaisse, this.id).subscribe(
      r => {
        this.ticket = r;
        this.spinner.hide();
      },
      this.caisseService.onError
    )
  }

}

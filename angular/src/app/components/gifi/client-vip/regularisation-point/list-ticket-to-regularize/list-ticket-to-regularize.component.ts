import { Component, Input, OnInit } from '@angular/core';
import { CarteVipService } from 'src/app/modules/marketing/carte-vip/services/carte-vip.service';

@Component({
  selector: 'app-list-ticket-to-regularize',
  templateUrl: './list-ticket-to-regularize.component.html',
  styleUrls: ['./list-ticket-to-regularize.component.scss']
})
export class ListTicketToRegularizeComponent implements OnInit {

  @Input() clientVip;
  tickets;

  constructor(
    private carteVipService: CarteVipService
  ) { }

  ngOnInit(): void {
    this.initializeTickets();
  }

  initializeTickets(){
    this.carteVipService.getTicketsToRegularize(this.clientVip.numClient).subscribe(
      (r)=> this.tickets = r,
      this.carteVipService.onError
    );
  }

  regularize(ticket, i){
    this.carteVipService.regularizePoint(ticket).subscribe(
      (r)=> {
        this.clientVip.point = parseInt(this.clientVip.point) + parseInt(r.point);
        this.tickets.splice(i, 1);
        this.carteVipService.notif.success("Régularisé");
      },
      this.carteVipService.onError
    );
  }

}

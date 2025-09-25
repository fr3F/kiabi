import { Component, Input, OnInit } from '@angular/core';
import { ListArticleTicketCaisseComponent } from '../../list-article-ticket-caisse/list-ticket-caisse.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';

@Component({
  selector: 'app-list-ticket-caisse',
  templateUrl: './list-ticket-caisse.component.html',
  styleUrls: ['./list-ticket-caisse.component.scss']
})
export class ListTicketCaisseComponent extends ListArticleTicketCaisseComponent {

  selectedTicket;
  @Input() acces;
  @Input() magasinObj;

  constructor(
    protected caisseService: CaisseService,
    protected spinner: NgxSpinnerService,
    protected datePipe: DatePipe,
    private modalService: NgbModal
  ) { 
    super(caisseService, spinner, datePipe);
  }

  search(){
    if(this.motSearch)
      this.list = this.listInitial.filter((r)=> r.numticket.includes(this.motSearch) || r.codeclient.includes(this.motSearch));
    else
      this.list = this.listInitial;
  }


  openDetail(modal, ticket){
    this.selectedTicket = ticket;
    this.modalService.open(modal, {size: "xl"});
  }


  chargerMagasin(ticket){
    this.spinner.show();
    this.caisseService.chargerTicketMagasinById(this.caisse.id, ticket.idticket).subscribe(
      (r)=>{
        this.spinner.hide();
        this.caisseService.notif.success("Chargé");
        ticket.ticketMagasin = true;
      },
      this.caisseService.onError
    )
  }

  showRegulVenteDepot(ticket){
    return ticket.ventedepot && !ticket.numeroFacture;
  }

  regulariserVenteDepot(ticket){
    this.spinner.show();
    this.caisseService.regulariserVenteDepot(ticket.idticket, this.magasinObj.code, this.caisse.nocaisse).subscribe(
      (r)=>{
        ticket.numeroFacture = r.numeroFacture;
        this.caisseService.notif.success("Facture régularisée");
        this.spinner.hide();
      },
      this.caisseService.onError
    )
  }

  
  async chargerListMagasin() {
    const ticketList = this.list.filter((r)=> !r.ticketMagasin)
    this.spinner.show();
    for (const ticket of ticketList) {
      try {
        await this.chargerTicket(ticket);
        // Attendre 1 secondes avant de traiter le prochain ticket
        await this.delay(1000);
      } catch (error) {
        this.caisseService.onError(error);
      }
    }
    this.caisseService.notif.success("Chargé");
    this.spinner.hide();
  }

  chargerTicket(ticket) {
    return new Promise((resolve, reject) => {
      this.caisseService.chargerTicketMagasinById(this.caisse.id, ticket.idticket).subscribe(
        (r) => {
          ticket.ticketMagasin = true;
          resolve(r);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

import { Component, OnInit } from '@angular/core';
import { ConsultationCaissePageComponent } from '../consultation-caisse-page/consultation-caisse-page.component';
import { SearchTicketCaisse } from 'src/app/components/reporting/caisse/interface';
import { Acces } from '../../base/base-page/acces.model';

@Component({
  selector: 'app-consultation-ticket-page',
  templateUrl: './consultation-ticket-page.component.html',
  styleUrls: ['./consultation-ticket-page.component.scss']
})
export class ConsultationTicketPageComponent extends ConsultationCaissePageComponent {

  idFonctionnalite: any = 117;

  tabFonctionnalite: Acces[] = [
    {idFonctionnalite: 125, nom: "regulVenteDepot"}
  ];

  refreshList($event: SearchTicketCaisse){
    this.setParams($event);
    this.caisseService.spinner.show();
    this.list = null;
    this.caisseService.getTickets(this.idCaisse, this.debut, this.fin).subscribe(
      r=> {
        setTimeout(()=>{
          this.list = r;
          this.caisseService.spinner.hide();
        }, 1000);
      },
      this.caisseService.onError
    )
  }
}

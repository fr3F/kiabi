import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { SearchTicketCaisseCode } from 'src/app/components/reporting/caisse/interface';

@Component({
  selector: 'app-consultation-caisse-code-page',
  templateUrl: './consultation-caisse-code-page.component.html',
  styleUrls: ['./consultation-caisse-code-page.component.scss']
})
export class ConsultationCaisseCodePageComponent extends  BasePageComponent  {

  idFonctionnalite: any = 115;

  code;
  magasin;
  debut;
  fin;


  setParams($event: SearchTicketCaisseCode){
    this.debut = $event.debut;
    this.fin = $event.fin;
    this.magasin = $event.magasin;
    this.code = $event.code;
  }
}

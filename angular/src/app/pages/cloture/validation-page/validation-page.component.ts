import { MenuService } from 'src/app/services/acces/menu.service';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { EncaissementService } from './../../../services/cloture/encaissement.service';
import { Component, OnInit } from '@angular/core';
import { Acces } from '../../base/base-page/acces.model';

@Component({
  selector: 'app-validation-page',
  templateUrl: './validation-page.component.html',
  styleUrls: ['./validation-page.component.scss']
})
export class ValidationPageComponent extends BasePageComponent{


  idMagasin;
  date;

  encaissements: any[];

  idFonctionnalite: any = 34;
  constructor(
    public menuServ: MenuService,
    private encaissementService: EncaissementService
  ) { 
    super(menuServ)
  }

  tabFonctionnalite: Acces[] = [
    {nom: "imprimerReglements", idFonctionnalite: 36},
    {nom: "supprimerEncaissement", idFonctionnalite: 59}
  ];

  change({idMagasin, date}){
    this.date = date;
    this.idMagasin = idMagasin;
    if(!date){
      this.encaissements = null;
      return;
    }
    this.encaissementService.getAValider(date, idMagasin).subscribe(
      (r)=> this.encaissements = r,
      this.encaissementService.onError
    )
  }
}

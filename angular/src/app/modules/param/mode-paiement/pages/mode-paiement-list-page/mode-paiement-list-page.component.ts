import { Component, OnInit } from '@angular/core';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ModePaiementService } from '../../services/mode-paiement.service';
import { AccesModepaiement } from '../../data';

@Component({
  selector: 'app-mode-paiement-list-page',
  templateUrl: './mode-paiement-list-page.component.html',
  styleUrls: ['./mode-paiement-list-page.component.scss']
})
export class ModePaiementListPageComponent extends BaseListPageComponent{
  
  title: string = "Les modes de paiements";
    constructor(
      public notif: NotificationService,
      public serv: MenuService,
      public baseServ: ModePaiementService,
    ) { 
      super(notif, serv, baseServ);
    }
  
    idFonctionnalite: number = AccesModepaiement.view;
  
    tabFonctionnalite: Acces[] = [
      {idFonctionnalite: AccesModepaiement.manage, nom: "ajouter"},
      {idFonctionnalite: AccesModepaiement.manage, nom: "modifier"},
      {idFonctionnalite: AccesModepaiement.manage, nom: "supprimer"},
      {idFonctionnalite: AccesModepaiement.manage, nom: "barcode"}
    ];

}

import { Component, OnInit } from '@angular/core';
import { AccesCarteVip } from 'src/app/modules/marketing/carte-vip/data';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-list-client-vip-page',
  templateUrl: './list-client-vip-page.component.html',
  styleUrls: ['./list-client-vip-page.component.scss']
})
export class ListClientVipPageComponent extends BaseListPageComponent{
  
  title: string = "Carte de fidélité";
  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: ClientVipService,
  ) { 
    super(notif, serv, baseServ);
  }
  
    idFonctionnalite: number = AccesCarteVip.view;
  
    tabFonctionnalite: Acces[] = [
      {idFonctionnalite: AccesCarteVip.create, nom: "ajouter"},
      {idFonctionnalite: AccesCarteVip.edit, nom: "modifier"},
      {idFonctionnalite: AccesCarteVip.delete, nom: "supprimer"},
      {idFonctionnalite: AccesCarteVip.export, nom: "exporter"},
      {idFonctionnalite: AccesCarteVip.view, nom: "carteVip"},
      {idFonctionnalite: AccesCarteVip.activate, nom: "activer"},
      {idFonctionnalite: AccesCarteVip.regul, nom: "regul"},
      {idFonctionnalite: AccesCarteVip.send, nom: "send"},
    ];

}

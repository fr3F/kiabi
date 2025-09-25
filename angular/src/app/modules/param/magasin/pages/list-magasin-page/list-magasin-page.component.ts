import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MagasinService } from '../../services/magasin.service';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { AccesMagasin } from '../../data';

@Component({
  selector: 'app-list-magasin-page',
  templateUrl: './list-magasin-page.component.html',
  styleUrls: ['./list-magasin-page.component.scss']
})
export class ListMagasinPageComponent extends BaseListPageComponent{
  
  title: string = "Liste des magasins";
  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: MagasinService,
  ) { 
    super(notif, serv, baseServ);
  }

  idFonctionnalite: number = 9;

  tabFonctionnalite: Acces[] = [
    {idFonctionnalite: AccesMagasin.create, nom: "ajouter"},
    {idFonctionnalite: AccesMagasin.update, nom: "modifier"},
    {idFonctionnalite: AccesMagasin.view, nom: "detail"}
  ];
}

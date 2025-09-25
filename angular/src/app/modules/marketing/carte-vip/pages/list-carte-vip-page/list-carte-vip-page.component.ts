import { Component, OnInit } from '@angular/core';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { AccesCarteVip } from '../../data';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';
import { CarteVipService } from '../../services/carte-vip.service';

@Component({
  selector: 'app-list-carte-vip-page',
  templateUrl: './list-carte-vip-page.component.html',
  styleUrls: ['./list-carte-vip-page.component.scss']
})
export class ListCarteVipPageComponent extends BaseListPageComponent {

  title: string = "Carte de fidelité - VIP";
  
  idFonctionnalite: number = AccesCarteVip.view;


  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: CarteVipService,
  ) { 
    super(notif, serv, baseServ);
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { AccesShipment } from '../../data';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-list-shipment-page',
  templateUrl: './list-shipment-page.component.html',
  styleUrls: ['./list-shipment-page.component.scss']
})
export class ListShipmentPageComponent extends BaseListPageComponent {

  title: string = "Shipments";

  idFonctionnalite: number = AccesShipment.view;
  pageSize: number = 10; 
  
  tabFonctionnalite: Acces[] = [
    { nom: "reception", idFonctionnalite: AccesShipment.reception }
  ];

  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: ShipmentService,
  ) { 
    super(notif, serv, baseServ);
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseFormPageComponent } from 'src/app/pages/base/base-form-page/base-form-page.component';
import { ShipmentService } from '../../services/shipment.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Shipment } from '../../models/shipment.model';
import { ShipmentBoxComponent } from "../../components/details/shipment-box/shipment-box.component";
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { AccesShipment } from '../../data';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-detail-shipment-page',
  templateUrl: './detail-shipment-page.component.html',
  styleUrls: ['./detail-shipment-page.component.scss']
})
export class DetailShipmentPageComponent extends BaseFormPageComponent{

  data: Shipment;
  
  tabFonctionnalite: Acces[] = [
    { nom: "reception", idFonctionnalite: AccesShipment.reception }
  ];

  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public serv: ShipmentService,
    public menuServ: MenuService
  ) {
    super(route, notif, serv, menuServ);
   }
 
}

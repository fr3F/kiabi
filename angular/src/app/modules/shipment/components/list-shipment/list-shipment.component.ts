import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment.model';

@Component({
  selector: 'app-list-shipment',
  templateUrl: './list-shipment.component.html',
  styleUrls: ['./list-shipment.component.scss']
})
export class ListShipmentComponent extends BaseListComponent{

  constructor(
    private shipmentService: ShipmentService
  ) { 
    super();
  }

  getClassStatus(shipment: Shipment){
    return this.shipmentService.getClassStatus(shipment);
  }
}

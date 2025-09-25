import { Component, Input, OnInit } from '@angular/core';
import { Shipment } from '../../../models/shipment.model';
import { ShipmentService } from '../../../services/shipment.service';

@Component({
  selector: 'app-info-shipment',
  templateUrl: './info-shipment.component.html',
  styleUrls: ['./info-shipment.component.scss']
})
export class InfoShipmentComponent implements OnInit {

  @Input() shipment: Shipment;
  @Input() acces;

  constructor(
    private shipmentService: ShipmentService
  ) { }

  ngOnInit(): void {
  }

  
  getClassStatus(){
    return this.shipmentService.getClassStatus(this.shipment);
  }

}

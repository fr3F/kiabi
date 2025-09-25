import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { Shipment } from '../models/shipment.model';
import { ShipmentStatus } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService extends BaseService{
  nomModele: string = "shipments";

  getClassStatus(shipment: Shipment){
    if(shipment.status == ShipmentStatus.new)
      return "badge-soft-warning"
    return "badge-soft-success"
  }

  receive(id: string){
    const url = this.apiUrl + "/" + this.nomModele + "/" + id + "/receive";
    return this.http.patch<Shipment>(url, {});
  }
}

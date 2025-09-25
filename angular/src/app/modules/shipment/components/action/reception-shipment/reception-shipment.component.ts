import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ShipmentService } from '../../../services/shipment.service';
import { Shipment } from '../../../models/shipment.model';
import { ShipmentStatus } from '../../../models/status.model';

@Component({
  selector: 'app-reception-shipment',
  templateUrl: './reception-shipment.component.html',
  styleUrls: ['./reception-shipment.component.scss']
})
export class ReceptionShipmentComponent implements OnInit {

  @Input() shipment: Shipment;
  @Input() acces;

  constructor(
    private spinner: NgxSpinnerService,
    private shipmentService: ShipmentService
  ) { }

  ngOnInit(): void {
  }

  receive(){
    this.spinner.show();
    this.shipmentService.receive(this.shipment.id).subscribe(
      this.onSuccess, 
      this.shipmentService.onError
    );
  }

  onSuccess = (r: Shipment) => {
    this.spinner.hide();
    this.shipmentService.notif.success("Réception");
    this.shipment.status = r.status;
    this.shipment.statusLabel = r.statusLabel;
    this.shipment.receiptDate = r.receiptDate;
    this.shipment.destockingNumber = r.destockingNumber;
  }

  showButton(){
    return this.acces.reception && this.shipment.status == ShipmentStatus.new;
  }
}

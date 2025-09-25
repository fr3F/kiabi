import { Component, Input, OnInit } from '@angular/core';
import { ItemShipment } from '../../../models/item.model';

@Component({
  selector: 'app-list-item-shipment',
  templateUrl: './list-item-shipment.component.html',
  styleUrls: ['./list-item-shipment.component.scss']
})
export class ListItemShipmentComponent implements OnInit {

  @Input() list: ItemShipment[];
  nbTarif = 9;
  constructor() { }

  ngOnInit(): void {
  }

  getTarifs(item: ItemShipment){
    const resp = [];
    for(let i = 1; i <= this.nbTarif; i++){
      const column = "tarifCode" + i;
      const value = item[column];
      if(value)
        resp.push(`Tarif code ${i}: ${value}`);
    }
    return resp;
  }

}

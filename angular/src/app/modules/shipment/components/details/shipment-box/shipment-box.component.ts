import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Box } from '../../../models/box.model';

@Component({
  selector: 'app-shipment-box',
  templateUrl: './shipment-box.component.html',
  styleUrls: ['./shipment-box.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      state('open', style({ opacity: 1, height: '*' })),
      state('closed', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ])
  ]
})
export class ShipmentBoxComponent implements OnInit {

  @Input() box: Box;
  itemShowed: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  toggleItem() {
    this.itemShowed = !this.itemShowed;
  }
}

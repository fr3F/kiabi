import { Component, Input, OnInit } from '@angular/core';
import { Carton } from '../../../models/carton.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-shipment-carton',
  templateUrl: './shipment-carton.component.html',
  styleUrls: ['./shipment-carton.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      state('open', style({ opacity: 1, height: '*' })),
      state('closed', style({ opacity: 0, height: '0px', overflow: 'hidden' })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ])
  ]
})
export class ShipmentCartonComponent implements OnInit {

  @Input() carton: Carton;
  itemShowed: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  toggleItem() {
    this.itemShowed = !this.itemShowed;
  }
}
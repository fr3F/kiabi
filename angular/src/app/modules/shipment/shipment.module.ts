import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShipmentRoutingModule } from './shipment-routing.module';
import { ListShipmentPageComponent } from './pages/list-shipment-page/list-shipment-page.component';
import { DetailShipmentPageComponent } from './pages/detail-shipment-page/detail-shipment-page.component';
import { ListShipmentComponent } from './components/list-shipment/list-shipment.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { InfoShipmentComponent } from './components/details/info-shipment/info-shipment.component';
import { ListItemShipmentComponent } from './components/details/list-item-shipment/list-item-shipment.component';
import { ShipmentBoxComponent } from './components/details/shipment-box/shipment-box.component';
import { ShipmentCartonComponent } from './components/details/shipment-carton/shipment-carton.component';
import { ReceptionShipmentComponent } from './components/action/reception-shipment/reception-shipment.component';


@NgModule({
  declarations: [
    ListShipmentPageComponent,
    DetailShipmentPageComponent,
    ListShipmentComponent,
    InfoShipmentComponent,
    ListItemShipmentComponent,
    ShipmentBoxComponent,
    ShipmentCartonComponent,
    ReceptionShipmentComponent
  ],
  imports: [
    CommonModule,
    ShipmentRoutingModule,
    UIModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgxLoadingModule
    
  ]
})
export class ShipmentModule { }

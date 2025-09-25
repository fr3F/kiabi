import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListShipmentPageComponent } from './pages/list-shipment-page/list-shipment-page.component';
import { DetailShipmentPageComponent } from './pages/detail-shipment-page/detail-shipment-page.component';

const routes: Routes = [
  { path: "", component: ListShipmentPageComponent },
  { path: "details/:id", component: DetailShipmentPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShipmentRoutingModule { }

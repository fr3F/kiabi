import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesPageComponent } from './pages/sales-page/sales-page.component';

const routes: Routes = [
  { path: "", component: SalesPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaleRoutingModule { }

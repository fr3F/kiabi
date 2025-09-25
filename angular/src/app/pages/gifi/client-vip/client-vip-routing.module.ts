import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListClientVipPageComponent } from './list-client-vip-page/list-client-vip-page.component';
import { AddClientVipPageComponent } from './add-client-vip-page/add-client-vip-page.component';
import { ReportingClientVipPageComponent } from './reporting-client-vip-page/reporting-client-vip-page.component';

const routes: Routes = [
  {
    path: "liste",
    component: ListClientVipPageComponent,
  },
  {
    path: "ajouter",
    component: AddClientVipPageComponent,
  },
  {
    path: "modifier/:id",
    component: AddClientVipPageComponent,
  },
  {
    path: "reporting",
    component: ReportingClientVipPageComponent,
  },
  {
    path: "parametrage",
    loadChildren: () => import('./../../../modules/marketing/carte-vip/carte-vip.module').then(m => m.CarteVipModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientVipRoutingModule { }

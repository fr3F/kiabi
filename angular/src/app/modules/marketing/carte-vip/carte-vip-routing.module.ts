import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrageVipPageComponent } from './pages/parametrage-vip-page/parametrage-vip-page.component';
// import { ListCarteVipPageComponent } from './pages/list-carte-vip-page/list-carte-vip-page.component';

const routes: Routes = [
  { path: "", component: ParametrageVipPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteVipRoutingModule { }

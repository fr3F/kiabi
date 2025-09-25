import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModePaiementListPageComponent } from './pages/mode-paiement-list-page/mode-paiement-list-page.component';

const routes: Routes = [
  {
    path: "",
    component: ModePaiementListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModePaiementRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationPageComponent } from './validation-page/validation-page.component';
import { ImportSagePageComponent } from './import-sage-page/import-sage-page.component';
import { DetailTicketMagasinPageComponent } from './detail-ticket-magasin-page/detail-ticket-magasin-page.component';
import { ParametragePageComponent } from './parametrage-page/parametrage-page.component';

const routes: Routes = [
  {
    path: "validation",
    component: ValidationPageComponent,
  },
  {
    path: "transfert-sage",
    component: ImportSagePageComponent,
  },
  {
    path: "detail-ticket/:magasin/:date/:client",
    component: DetailTicketMagasinPageComponent,
  },
  {
    path: "parametrage",
    component: ParametragePageComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClotureRoutingModule { }

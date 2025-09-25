import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListesInventairesPageComponent } from './listes-inventaires-page/listes-inventaires-page.component';
import { DetailsInventaireComponent } from 'src/app/components/inventaire/details-inventaire/details-inventaire.component';

const routes: Routes = [
  {path: "listes", component: ListesInventairesPageComponent},
  {path: "detail/:id", component: DetailsInventaireComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventaireRoutingModule { }

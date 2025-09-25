import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMagasinPageComponent } from './pages/form-magasin-page/form-magasin-page.component';
import { DetailMagasinPageComponent } from './pages/detail-magasin-page/detail-magasin-page.component';
import { ListMagasinPageComponent } from './pages/list-magasin-page/list-magasin-page.component';

const routes: Routes = [
  {
    path: "list",
    component: ListMagasinPageComponent,
  },
  {
    path: "add",
    component: FormMagasinPageComponent,
  },
  {
    path: "detail/:id",
    component: DetailMagasinPageComponent,
  },
  {
    path: "modifier/:id",
    component: FormMagasinPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MagasinRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListCatalogPageComponent } from './pages/list-catalog-page/list-catalog-page.component';

const routes: Routes = [
  {
    path: "",
    component: ListCatalogPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }

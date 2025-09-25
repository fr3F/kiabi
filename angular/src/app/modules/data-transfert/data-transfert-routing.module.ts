import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataTransfertPageComponent } from './pages/data-transfert-page/data-transfert-page.component';

const routes: Routes = [
  { path: "", component: DataTransfertPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataTransfertRoutingModule { }

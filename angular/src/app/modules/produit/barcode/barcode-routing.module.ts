import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportBarcodePageComponent } from './pages/import-barcode-page/import-barcode-page.component';

const routes: Routes = [
  { path: "", component: ImportBarcodePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarcodeRoutingModule { }

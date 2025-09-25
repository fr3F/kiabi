import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarcodeRoutingModule } from './barcode-routing.module';
import { ImportBarcodePageComponent } from './pages/import-barcode-page/import-barcode-page.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormImportBarcodeComponent } from './components/form-import-barcode/form-import-barcode.component';
import { ListBarcodeImportComponent } from './components/list-barcode-import/list-barcode-import.component';
import { FormsModule } from '@angular/forms';
import { PrintBarcodeComponent } from './components/print-barcode/print-barcode.component';


@NgModule({
  declarations: [
    ImportBarcodePageComponent,
    FormImportBarcodeComponent,
    ListBarcodeImportComponent,
    PrintBarcodeComponent
  ],
  imports: [
    CommonModule,
    BarcodeRoutingModule,
    NgxSpinnerModule,
    UIModule,
    FormsModule
  ]
})
export class BarcodeModule { }

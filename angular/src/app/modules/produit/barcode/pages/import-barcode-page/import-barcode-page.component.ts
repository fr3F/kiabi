import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from 'src/app/pages/base/base-page/base-page.component';
import { AccesBarcode } from '../../data';
import { BarcodeImport } from '../../models/barcodeImport.model';

@Component({
  selector: 'app-import-barcode-page',
  templateUrl: './import-barcode-page.component.html',
  styleUrls: ['./import-barcode-page.component.scss']
})
export class ImportBarcodePageComponent extends BasePageComponent {

  idFonctionnalite: any = AccesBarcode.manage;

  barcodes: BarcodeImport[];

  setBarcodes(list: BarcodeImport[]){
    this.barcodes = list;
    console.log(list)
  }
}

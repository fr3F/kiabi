import { Component, Input, OnInit } from '@angular/core';
import { BarcodeImport } from '../../models/barcodeImport.model';

@Component({
  selector: 'app-list-barcode-import',
  templateUrl: './list-barcode-import.component.html',
  styleUrls: ['./list-barcode-import.component.scss']
})
export class ListBarcodeImportComponent implements OnInit {

  @Input() barcodes: BarcodeImport[];
  
  constructor() { }

  ngOnInit(): void {
  }

}

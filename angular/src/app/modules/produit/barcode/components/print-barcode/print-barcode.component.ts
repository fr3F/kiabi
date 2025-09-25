import { Component, Input, OnInit } from '@angular/core';
import { BarcodeImport } from '../../models/barcodeImport.model';
import { BarcodeService } from '../../services/barcode.service';
import { NgxSpinnerService } from 'ngx-spinner';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrls: ['./print-barcode.component.scss']
})
export class PrintBarcodeComponent implements OnInit {

  @Input() barcodes: BarcodeImport[];

  constructor(
    private spinner: NgxSpinnerService,
    private barcodeService: BarcodeService,
  ) { }

  ngOnInit(): void {
  }
  
  print(){
    this.spinner.show();
    this.barcodeService.print(this.barcodes).subscribe(
      this.onSuccess,
      this.barcodeService.onError
    )
  }

  onSuccess = (r)=>{
    const filename = `Code-barres.pdf`
    FileSaver.saveAs(r, filename);
    this.spinner.hide();
  }

  showPrint(){
    return this.barcodes && this.barcodes.length;
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeService } from '../../services/barcode.service';
import { BarcodeImport } from '../../models/barcodeImport.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-import-barcode',
  templateUrl: './form-import-barcode.component.html',
  styleUrls: ['./form-import-barcode.component.scss']
})
export class FormImportBarcodeComponent implements OnInit {

  filename = "";
  @Output() onImport = new EventEmitter<BarcodeImport[]>();
  urlModele = environment.apiUrl + "/../modeles/produits/barcode.xlsx"

  constructor(
    private spinner: NgxSpinnerService,
    private barcodeService: BarcodeService
  ) { }

  ngOnInit(): void {
  }

  addFile($event){
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      let file = target.files[0];
      let me = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        me.importFile(reader.result);
      };
    }
  }

  importFile(file){
    this.spinner.show();
    this.barcodeService.importExcel(file).subscribe(
      this.onImportSuccess,
      this.onImportError
    )
  }

  onImportSuccess = (r) =>{
    this.spinner.hide();
    this.filename = "";
    this.barcodeService.notif.success("Codes barres importés avec succès");
    this.onImport.emit(r);
  }

  onImportError = (err)=>{
    this.barcodeService.onError(err);
    this.filename = "";
  }


}

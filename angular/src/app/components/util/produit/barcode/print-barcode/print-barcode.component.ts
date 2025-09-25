import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as FileSaver from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { BarcodeService } from 'src/app/modules/produit/barcode/services/barcode.service';

@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrls: ['./print-barcode.component.scss']
})
export class PrintBarcodeComponent implements OnInit {

  @Input() barcode;
  modalRef: NgbModalRef;
  nombre = 1;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private barcodeService: BarcodeService
  ) { }

  ngOnInit(): void {
  }

  openModal(modal){
    this.modalRef = this.modalService.open(modal, { size: "sm"});
  }


  print(){
    this.spinner.show();
    this.barcodeService.printOne(this.barcode, this.nombre).subscribe(
      this.onSuccessPrint,
      this.barcodeService.onError
    )    
  }
  
  get filename(){
    return `${this.barcode.barcode}.pdf`
  }

  onSuccessPrint = (r)=>{
    FileSaver.saveAs(r, this.filename);
    this.spinner.hide();
  }
  
}

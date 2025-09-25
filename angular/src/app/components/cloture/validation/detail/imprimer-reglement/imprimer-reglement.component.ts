import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncaissementService } from 'src/app/services/cloture/encaissement.service';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-imprimer-reglement',
  templateUrl: './imprimer-reglement.component.html',
  styleUrls: ['./imprimer-reglement.component.scss']
})
export class ImprimerReglementComponent implements OnInit {


  @Input() encaissement;
  @Input() ngClass = "";

  constructor(
    private spinner: NgxSpinnerService,
    private encaissementService: EncaissementService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }



  imprimerReglement(){
    this.spinner.show();
    this.encaissementService.imprimerReglements(this.encaissement.idencaissement).subscribe(
      this.onSuccess,
      this.encaissementService.onError
    )
  }

  onSuccess = (r)=>{
    const dateFile = this.datePipe.transform(this.encaissement.createdAt, "dd-MM-yyyy");
    const filename = `Reglement-${this.encaissement.magasin}(${this.encaissement.nocaisse})-${dateFile}.pdf`
    FileSaver.saveAs(r, filename);
    this.spinner.hide();
  }


}

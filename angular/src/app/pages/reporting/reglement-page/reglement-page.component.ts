import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import * as FileSaver from 'file-saver';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-reglement-page',
  templateUrl: './reglement-page.component.html',
  styleUrls: ['./reglement-page.component.scss']
})
export class ReglementPageComponent extends BasePageComponent {

  idFonctionnalite: any = 138;
  data;
  magasin;
  params;
  constructor(
    private spinner: NgxSpinnerService,
    private reportingService: ReportingService,
    private datePipe: DatePipe,
    public menuService: MenuService
  ) {
    super(menuService);
  }

  change($event: any){
    this.data = null;
    this.params = $event;
    this.magasin = $event.magasin;
    const {dateDebut, dateFin, idMagasin} = $event;
    if(!dateDebut || !dateFin)
      return;
    this.spinner.show();
    this.reportingService.getReglements(idMagasin, dateDebut, dateFin).subscribe(
      (r)=>{
        this.spinner.hide();
        this.data = r;
      },
      this.reportingService.onError
    )
  }

  exporter(){
    this.spinner.show();
    const {dateDebut, dateFin, idMagasin} = this.params;
    this.reportingService.exportReglements(idMagasin, dateDebut, dateFin).subscribe(
      (res)=>{
        this.spinner.hide();
        FileSaver.saveAs(res, this.getFilename())
      },
      this.reportingService.onError
    )
  }

  getFilename(){
    let fileName = `Règlements-${this.datePipe.transform(this.params.dateDebut, 'dd-MM-yyyy')}`;
    if(this.params.dateDebut != this.params.dateFin)
      fileName += `-au-${this.datePipe.transform(this.params.dateFin, 'dd-MM-yyyy')}`
    if(this.magasin)
      fileName += '-' + this.magasin.nommagasin;
    return fileName + ".xlsx";
  }

}

import { ReportingService } from './../../../services/reporting/reporting.service';
import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { Acces } from '../../base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reporting-page',
  templateUrl: './reporting-page.component.html',
  styleUrls: ['./reporting-page.component.scss']
})
export class ReportingPageComponent extends BasePageComponent{

  idFonctionnalite: any = 39;

  params;
  data;
  recap; // Recaputilatif

  constructor(
    public menuServ: MenuService,
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    super(menuServ)
  }

  tabFonctionnalite: Acces[] = [
    {nom: "exporter", idFonctionnalite: 40}
  ];

  change($event){
    this.data = null;
    this.params = $event;
    if(!$event.dateDebut || !$event.dateFin)
      return;
    this.spinner.show();
    this.reportingService.getReportings($event).subscribe(
      (r)=>{
        this.spinner.hide();
        this.data = r;
        this.setRecapitulatif();
      },
      this.reportingService.onError
    )
  }

  exporter(){
    this.spinner.show();
    this.reportingService.exporterExcel(this.params).subscribe(
      (res)=>{
        this.spinner.hide();
        FileSaver.saveAs(res, this.getFilename())
      },
      this.reportingService.onError
    )
  }

  getFilename(){
    let fileName = `Reporting-${this.datePipe.transform(this.params.dateDebut, 'dd-MM-yyyy')}`;
   if(this.params.dateDebut != this.params.dateFin)
      fileName += `-au-${this.datePipe.transform(this.params.dateFin, 'dd-MM-yyyy')}`
    return fileName + ".xlsx";
  }

  setRecapitulatif(){
    this.recap = this.reportingService.getRecaputilatifTicket(this.data);
  }
}

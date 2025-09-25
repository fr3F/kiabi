import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-consultation-stock-page',
  templateUrl: './consultation-stock-page.component.html',
  styleUrls: ['./consultation-stock-page.component.scss']
})
export class ConsultationStockPageComponent extends  BasePageComponent {

  idFonctionnalite: any = 139;
  magasin;
  code;
  list: any[];
  constructor(
    public menuService: MenuService,
    private reportingService: ReportingService
  ) {
    super(menuService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    // this.caisseService.spinner.hide();
  }

  setParams($event: any){
    this.magasin = $event.magasin;
    this.code = $event.code;
  }

  refreshList($event: any){
    this.setParams($event);
    this.list = null;
    if(!this.code || !this.magasin)
      return;
    this.reportingService.spinner.show();
    this.reportingService.consulterStockArticles(this.code, this.magasin.id).subscribe(
      r=> {
          this.list = r;
          this.reportingService.spinner.hide();
      },
      this.reportingService.onError
    )
  }

  exporter(){
    this.reportingService.spinner.show();
    this.reportingService.exporterStockArticles(this.code, this.magasin.id).subscribe(
      (res)=>{
        this.reportingService.spinner.hide();
        FileSaver.saveAs(res, this.getFilename())
      },
      this.reportingService.onError
    )
  }

  getFilename(){
    let fileName = `Stocks-articles-${this.code}`;
    fileName += '-' + this.magasin.nommagasin;
    return fileName + ".xlsx";
  }
}

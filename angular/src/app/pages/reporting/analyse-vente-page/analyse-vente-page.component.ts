import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseListPageComponent } from '../../base/base-list-page/base-list-page.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-analyse-vente-page',
  templateUrl: './analyse-vente-page.component.html',
  styleUrls: ['./analyse-vente-page.component.scss']
})
export class AnalyseVentePageComponent extends BaseListPageComponent {

  data;

  constructor(
    private spinner: NgxSpinnerService,
    public reportingService: ReportingService,
    
    public notif: NotificationService,
    public serv: MenuService,
    private cdk: ChangeDetectorRef
  ) { 
    super(notif, serv, reportingService);
  }

  ngOnInit(): void {
  }
  
  idMagasin;
  type;

  pageSize: number = 100;
  change({idMagasin, type}){
    this.page = 1;
    this.count = 0;
    this.idMagasin = idMagasin;
    this.type = type;
    this.refreshData();
  }

  refreshData(): void {
    if(!this.idMagasin){
      this.data = undefined;
      this.cdk.markForCheck();
      return;
    }
    this.spinner.show();
    this.reportingService.getVariationVentes(this.idMagasin, this.type, this.getParamSearch()).subscribe(
      (response: any)=>{
        this.data = response.data;
        this.count = response.totalItems; 
        this.spinner.hide();
        this.cdk.markForCheck();
      },
      this.reportingService.onError
    )
      
  }
}

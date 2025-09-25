import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ReportingService } from 'src/app/services/reporting/reporting.service';

@Component({
  selector: 'app-list-ventes-article',
  templateUrl: './list-ventes-article.component.html',
  styleUrls: ['./list-ventes-article.component.scss']
})
export class ListVentesArticleComponent extends BaseListPageComponent implements OnChanges {

  @Input() code;
  @Input() idMagasin;

  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: ReportingService 
  ) { 
    super(notif, serv, baseServ);
  }
  
  refreshData(){
    this.loading = true;
    this.baseServ.spinner.show();
    this.subscription = this.baseServ.listVentes(this.getParamSearch())
      .subscribe(this.onSucces, this.onError);
  }

  getParamSearch() : any{
    const params = super.getParamSearch();
    params.code = this.code;
    params.idMagasin = this.idMagasin;
    return params;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.idMagasin && !changes.idMagasin.firstChange) ||
        changes.code && !changes.code.firstChange
    ) {
      this.search();
    }
  }
}

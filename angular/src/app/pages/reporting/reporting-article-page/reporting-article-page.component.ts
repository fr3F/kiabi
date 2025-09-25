import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-reporting-article-page',
  templateUrl: './reporting-article-page.component.html',
  styleUrls: ['./reporting-article-page.component.scss']
})
export class ReportingArticlePageComponent extends BasePageComponent{

  idFonctionnalite: any = 167;
  list: any[];
  isBarcode: boolean;

  setList($event: any){
    this.list = $event.list;
    this.isBarcode = $event.isBarcode;
  }

}

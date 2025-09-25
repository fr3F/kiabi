import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { Acces } from '../../base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportingService } from 'src/app/services/reporting/reporting.service';

@Component({
  selector: 'app-controle-page',
  templateUrl: './controle-page.component.html',
  styleUrls: ['./controle-page.component.scss']
})
export class ControlePageComponent extends BasePageComponent{


  date;

  data;

  resume;
  sommaireReglement;
  totalReglement;

  idFonctionnalite: any = 46;

  tabFonctionnalite: Acces[] = [
    {nom: "details", idFonctionnalite: 62}
  ];
  constructor(
    public menuServ: MenuService,
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService
  ) { 
    super(menuServ)
  }


  change({date}){
    this.date = date;
    this.spinner.show();
    this.reportingService.getControle(date).subscribe(
      (r)=> {
        this.data = r;
        this.spinner.hide();
      },
      this.reportingService.onError
    )
  }

}

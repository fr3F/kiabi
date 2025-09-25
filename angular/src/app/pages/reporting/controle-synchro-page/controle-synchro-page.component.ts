import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Acces } from '../../base/base-page/acces.model';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-controle-synchro-page',
  templateUrl: './controle-synchro-page.component.html',
  styleUrls: ['./controle-synchro-page.component.scss']
})
export class ControleSynchroPageComponent extends BasePageComponent {
  magasins: any;
  idMagasin = "";

  idFonctionnalite: any = 92;

  tabFonctionnalite: Acces[] = [
    {idFonctionnalite: 19, nom: "reinstallTable"}
  ];
  data;

  constructor(
    public menuServ: MenuService,
    private magasinService: MagasinService,
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService

  ) { 
    super(menuServ);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeMagasins();
  }

  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      r=> {
        this.magasins = r
        if(this.magasins.length == 1){
          this.idMagasin = this.magasins[0].id;
          this.refreshData();
        }
      },
      this.magasinService.onError
    );
  }

  refreshData(){
    if(!this.idMagasin)
      return;
    this.spinner.show();
    this.reportingService.controlSynchro(this.idMagasin)
      .subscribe(
        (r)=> {
          this.data = r;
          this.spinner.hide();
        },
        this.reportingService.onError
      )
  }

}

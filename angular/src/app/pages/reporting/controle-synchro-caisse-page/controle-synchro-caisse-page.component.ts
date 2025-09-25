import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { Acces } from '../../base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-controle-synchro-caisse-page',
  templateUrl: './controle-synchro-caisse-page.component.html',
  styleUrls: ['./controle-synchro-caisse-page.component.scss']
})
export class ControleSynchroCaissePageComponent extends BasePageComponent {
  magasins: any;
  idCaisse = "";
  idMagasin = "";

  idFonctionnalite: any = 99;

  caisses;

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
      },
      this.magasinService.onError
    );
  }

  refreshData(){
    if(!this.idCaisse)
      return;
    this.spinner.show();
    this.reportingService.controlSynchroCaisse(this.idCaisse)
      .subscribe(
        (r)=> {
          this.data = r;
          this.spinner.hide();
        },
        this.reportingService.onError
      )
  }

  changeMagasin(){
    this.idCaisse = "";
    if(this.idMagasin){
      const magasin = this.magasins.find((r)=> r.id == this.idMagasin);
      this.caisses = magasin.caisses;
    }
  }
}

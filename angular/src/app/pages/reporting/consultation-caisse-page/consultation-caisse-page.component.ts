import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { SearchTicketCaisse } from 'src/app/components/reporting/caisse/interface';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';

@Component({
  selector: 'app-consultation-caisse-page',
  templateUrl: './consultation-caisse-page.component.html',
  styleUrls: ['./consultation-caisse-page.component.scss']
})
export class ConsultationCaissePageComponent extends  BasePageComponent {

  idFonctionnalite: any = 114;
  debut;
  fin;
  idCaisse;
  caisse;
  magasin;
  magasinObj;
  client;

  list: any[];
  constructor(
    public menuService: MenuService,
    protected caisseService: CaisseService
  ) {
    super(menuService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.caisseService.spinner.hide();
  }

  setParams($event: SearchTicketCaisse){
    this.debut = $event.debut;
    this.fin = $event.fin;
    this.caisse = $event.caisse;
    this.magasin = $event.magasin;
    this.magasinObj = $event.magasinObj;
    this.idCaisse = $event.caisse.id;
    this.client = $event.client;
  }

  refreshList($event: SearchTicketCaisse){
    this.setParams($event);
    this.caisseService.spinner.show();
    this.list = null;
    this.caisseService.getArticleTickets(this.idCaisse, this.debut, this.fin, this.client).subscribe(
      r=> {
        setTimeout(()=>{
          this.list = r;
          this.caisseService.spinner.hide();
        }, 1000);
      },
      this.caisseService.onError
    )
  }
}

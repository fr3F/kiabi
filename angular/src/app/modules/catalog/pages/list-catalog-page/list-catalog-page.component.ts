import { Component, OnInit } from '@angular/core';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';
import { AccesCatalog } from '../../data';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';
import { CatalogService } from '../../services/catalog.service';
import { CLSHierrarchy } from '../../models/cls-hierrarchy.model';

@Component({
  selector: 'app-list-catalog-page',
  templateUrl: './list-catalog-page.component.html',
  styleUrls: ['./list-catalog-page.component.scss']
})
export class ListCatalogPageComponent extends BaseListPageComponent {

    title: string = "Catalogs";
    clsHierrarchy: CLSHierrarchy;

    idFonctionnalite: number = AccesCatalog.view;
    pageSize: number = 99;

    tabFonctionnalite: Acces[] = [
    ];

    constructor(
      public notif: NotificationService,
      public serv: MenuService,
      public baseServ: CatalogService,
    ) {
      super(notif, serv, baseServ);
    }

    getParamSearch() {
      const params = super.getParamSearch();
      this.addCLSToParams(params);
      return params;
    }

    addCLSToParams(params){
      if(this.clsHierrarchy){
        params.clsType = this.clsHierrarchy.type;
        params.clsValue = this.clsHierrarchy.value;
      }
    }

    hierrarchyChange(cls: CLSHierrarchy){
      this.clsHierrarchy = cls;
      this.motSearch = "";
      this.search();
    }

}



import { Component, OnInit } from '@angular/core';
import { AccesData } from '../../data';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';
import { DataTransfertService } from '../../services/data-transfert.service';
import { BaseListPageComponent } from 'src/app/pages/base/base-list-page/base-list-page.component';

@Component({
  selector: 'app-data-transfert-page',
  templateUrl: './data-transfert-page.component.html',
  styleUrls: ['./data-transfert-page.component.scss']
})
export class DataTransfertPageComponent extends BaseListPageComponent {

    title: string = "Data transferts";
    
    idFonctionnalite: number = AccesData.view;
    pageSize: number = 100; 
    tabFonctionnalite: Acces[] = [
      {idFonctionnalite: AccesData.update, nom: "update"},
    ];
  
    constructor(
      public notif: NotificationService,
      public serv: MenuService,
      public baseServ: DataTransfertService,
    ) { 
      super(notif, serv, baseServ);
    }

    
  refreshData(){
    this.loading = true;
    // this.unsubscribe()
    this.subscription = this.baseServ.listHistoriques(this.getParamSearch())
      .subscribe(this.onSucces, this.onError);
  }

}

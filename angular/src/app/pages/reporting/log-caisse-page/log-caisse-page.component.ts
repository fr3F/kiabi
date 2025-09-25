import { MenuService } from './../../../services/acces/menu.service';
import { LogCaisseService } from './../../../services/caisse/log-caisse.service';
import { Component } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';

@Component({
  selector: 'app-log-caisse-page',
  templateUrl: './log-caisse-page.component.html',
  styleUrls: ['./log-caisse-page.component.scss']
})
export class LogCaissePageComponent extends BasePageComponent {

  idFonctionnalite: any = 95;

  date;
  message;
  data;

  constructor(
    public menuService: MenuService,
    private logCaisseService: LogCaisseService
  ){
    super(menuService)
  }

  refresh({date, message}){
    this.date = date;
    this.message = message;
    this.refreshData();
  }


  refreshData(){
    if(!this.date || !this.message)
      this.data = null;
    else{
      this.logCaisseService.getList(this.date, this.message).subscribe(
        (r)=> this.data = r,
        this.logCaisseService.onError
      );
    }
  }
}

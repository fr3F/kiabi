import { ParametrageClotureService } from './../../../services/cloture/parametrage-cloture.service';
import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-parametrage-page',
  templateUrl: './parametrage-page.component.html',
  styleUrls: ['./parametrage-page.component.scss']
})
export class ParametragePageComponent extends BasePageComponent{


  list;

  idFonctionnalite: any = 94;
  constructor(
    public menuServ: MenuService,
    private parametrageClotureService: ParametrageClotureService
  ) { 
    super(menuServ)
  }

  ngOnInit(): void {
      super.ngOnInit();
      this.refreshList();
  }

  refreshList(){
    this.parametrageClotureService.list({}).subscribe(
      (r)=> {
        this.list = r;
        for(const item of this.list){
          item.idMagasins = item.items.map((r)=> r.idMagasin);
          item.magasins = item.items.map((r)=> r.magasin);
        }
      },
      this.parametrageClotureService.onError
    );
  }

}

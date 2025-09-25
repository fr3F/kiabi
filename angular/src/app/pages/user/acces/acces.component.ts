import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/acces/menu.service';
import { BasePageComponent } from '../../base/base-page/base-page.component';

@Component({
  selector: 'app-acces',
  templateUrl: './acces.component.html',
  styleUrls: ['./acces.component.scss']
})
export class AccesComponent extends BasePageComponent {

  constructor(
    public menuServ: MenuService
  ) { 
    super(menuServ);
  }

  idFonctionnalite: any = 8; 
  ngOnInit(): void {
    this.testAccess()
  }


  titre = "Gestion d'accès"
}

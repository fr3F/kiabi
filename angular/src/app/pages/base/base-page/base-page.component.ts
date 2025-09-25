import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/acces/menu.service';
import { Acces } from './acces.model';

@Component({
  selector: 'app-base-page',
  templateUrl: './base-page.component.html',
  styleUrls: ['./base-page.component.scss']
})
export class BasePageComponent implements OnInit {

  acces: any = {};
  tabFonctionnalite:Acces [] = [];

  constructor(
    public menuServ: MenuService
  ) { }

  ngOnInit(): void {
    this.testAccess()
    this.initializeTabAccess();
  }

  idFonctionnalite;

  testAccess(){
    this.menuServ.verifierAccesPage(this.idFonctionnalite)
  }

  initializeAccess(idFonctionnalite, nom){
    this.menuServ.testAcces(idFonctionnalite).subscribe(
      (r: {acces: boolean}) => this.acces[nom] = r.acces,
      this.menuServ.onError
    )
  }

  initializeTabAccess(){
    for(let item of this.tabFonctionnalite)
      this.initializeAccess(item.idFonctionnalite, item.nom)
  }

}

import { Component, OnInit } from '@angular/core';
import { Acces } from 'src/app/pages/base/base-page/acces.model';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.scss']
})
export class BaseComponentComponent implements OnInit {

  idModule:number;
  fonctionnalites;

  acces: any = {};
  tabFonctionnalite:Acces [] = [];

  idFonctionnalite:number;

  constructor(
    public serv: MenuService,
    public notif: NotificationService
  ) { }

  ngOnInit(): void {  
    this.testAccess();
    this.initializeTabAccess();
  }
  
  loading:boolean

  
  onError = (err) => {
    this.loading = false;
    // console.log('8ss989898')
    this.notif.error(err)
  }

  initializeFonctionnalite(){
    if(!this.idModule)  
      return;
    const onSuccess = (resp) =>{
      this.fonctionnalites = resp;
    }
    this.serv.getFonctionnaliteModuleRole(this.idModule)
      .subscribe(onSuccess, this.onError);
  }

  isVisible(type){
    for(let i = 0; i < this.fonctionnalites.length; i++){
      if(type == this.fonctionnalites[i].type)
        return true;
    } 
    return false;
  }

  testAccess(){
    this.serv.verifierAccesPage(this.idFonctionnalite)
  }

  initializeAccess(idFonctionnalite, nom){
    this.serv.testAcces(idFonctionnalite).subscribe(
      (r: {acces: boolean}) => this.acces[nom] = r.acces,
      this.serv.onError
    )
  }

  initializeTabAccess(){
    for(let item of this.tabFonctionnalite)
      this.initializeAccess(item.idFonctionnalite, item.nom)
  }

}

import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { EncaissementService } from 'src/app/services/cloture/encaissement.service';
import { Acces } from '../../base/base-page/acces.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-import-sage-page',
  templateUrl: './import-sage-page.component.html',
  styleUrls: ['./import-sage-page.component.scss']
})
export class ImportSagePageComponent extends BasePageComponent{


  date;
  idParametrage;

  data;

  resume;
  sommaireReglement;
  totalReglement;

  idFonctionnalite: any = 35;

  tabFonctionnalite: Acces[] = [
    {nom: "detailTicket", idFonctionnalite: 37}
  ];
  constructor(
    public menuServ: MenuService,
    private encaissementService: EncaissementService,
    private spinner: NgxSpinnerService
  ) { 
    super(menuServ)
  }


  change({date, refresh, idParametrage}){
    this.date = date;
    this.idParametrage = idParametrage;
    if(!this.idParametrage)
      return;
    // if(!refresh)
    this.refresh()
    // this.initStock();
    // else
    //   this.initStock();
  } 

  refresh(){
    this.spinner.show();
    this.encaissementService.getARegulariser(this.date, this.idParametrage).subscribe(
      (r)=> {
        this.data = r;
        this.spinner.hide();
        this.changeResume(this.date);
        this.changeSommaireReglement(this.date);
      },
      this.encaissementService.onError
    )
  }

  changeResume(date){
    this.resume = null;
    if(this.data.exist)
    this.encaissementService.getResumeJour(date, this.idParametrage).subscribe(
      (r)=> this.resume = r,
      this.encaissementService.onError
    )
  }

  changeSommaireReglement(date){
    this.sommaireReglement = null;
    if(this.data.exist)
    this.encaissementService.getSommaireReglement(date, this.idParametrage).subscribe(
      (r)=> {
        this.sommaireReglement = r;
        this.setTotalReglement();
      },
      this.encaissementService.onError
    )
  }

  setTotalReglement(){
    this.totalReglement = this.encaissementService.getTotalReglement(this.sommaireReglement);
  }
  
  initStock(){
    this.spinner.show();
    this.encaissementService.initStock().subscribe(
      (r)=>{
        this.initCump();
      },
      this.encaissementService.onError
    )
  }

  initCump(){
    this.encaissementService.initCump().subscribe(
      (r)=>{
        this.refresh();
      },
      this.encaissementService.onError
    )
  }
}

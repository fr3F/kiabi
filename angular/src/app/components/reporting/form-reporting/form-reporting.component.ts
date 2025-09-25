import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-reporting',
  templateUrl: './form-reporting.component.html',
  styleUrls: ['./form-reporting.component.scss']
})
export class FormReportingComponent implements OnInit {

  magasins;
  allMagasins;
  idMagasin = "";

  dateDebut = "";
  dateFin = "";

  codeclient = "";

  @Output() onChange = new EventEmitter();
  
  constructor(
    private magasinService: MagasinService,
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
    this.initializeAllMagasins();
  }

  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      r=> {
        this.magasins = r;
        if(this.magasins.length == 1){
          this.idMagasin = this.magasins[0].id;
          this.change();
        }
      },
      this.magasinService.onError
    )
  }

  
  initializeAllMagasins(){
    this.magasinService.findAll().subscribe(
      r=> this.allMagasins = r,
      this.magasinService.onError
    )
  }

  change(){
    const params = {dateDebut: this.dateDebut, dateFin: this.dateFin, 
                    codeclient: this.codeclient, idMagasin: this.idMagasin}
    this.onChange.emit(params);
  }

  changeDate({dateDebut, dateFin}){
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.change();
  }

  changeClient(client){
    if(typeof(client) != "string")
      return;
    this.codeclient = client;
    this.change();
  }

  afficherTous(){
    return this.magasins && this.allMagasins && this.magasins.length == this.allMagasins.length;
  }

}

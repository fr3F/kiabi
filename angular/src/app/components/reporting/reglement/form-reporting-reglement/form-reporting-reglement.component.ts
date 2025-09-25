import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-reporting-reglement',
  templateUrl: './form-reporting-reglement.component.html',
  styleUrls: ['./form-reporting-reglement.component.scss']
})
export class FormReportingReglementComponent implements OnInit {

  magasins;
  allMagasins;
  idMagasin = "";

  dateDebut = "";
  dateFin = "";


  @Output() onChange = new EventEmitter();
  
  constructor(
    private magasinService: MagasinService,
  ) { }

  ngOnInit(): void {
    this.initializeAllMagasins();
  }

  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      r=> {
        this.magasins = r;
        if(this.magasins.length == 1){
          this.idMagasin = this.magasins[0].id;
        }
      },
      this.magasinService.onError
    )
  }

  
  initializeAllMagasins(){
    this.magasinService.findAll().subscribe(
      r=>{
        this.allMagasins = r;
        this.initializeMagasins();
      },
      this.magasinService.onError
    )
  }

  change(){
    const magasin = this.magasins.find((r)=> r.id== this.idMagasin);
    const params = {dateDebut: this.dateDebut, dateFin: this.dateFin, 
                     idMagasin: this.idMagasin, magasin};
    this.onChange.emit(params);
  }

  changeDate({dateDebut, dateFin}){
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
  }


  afficherTous(){
    return this.magasins && this.allMagasins && this.magasins.length == this.allMagasins.length;
  }

  isAll(){
    return this.magasins && this.magasins.length == this.allMagasins.length;
  }
}

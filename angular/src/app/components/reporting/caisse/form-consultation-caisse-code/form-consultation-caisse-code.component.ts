import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SearchTicketCaisseCode } from '../interface';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-consultation-caisse-code',
  templateUrl: './form-consultation-caisse-code.component.html',
  styleUrls: ['./form-consultation-caisse-code.component.scss']
})
export class FormConsultationCaisseCodeComponent implements OnInit {

  magasins;
  idMagasin = "";
  magasin;
  idCaisse;
  fin = "";
  debut = "";
  code = "";

  @Output() onSearch  = new EventEmitter<SearchTicketCaisseCode>();

  constructor(
    private magasinService: MagasinService,

  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
  }


  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      r=> {
        this.magasins = r;
        if(this.magasins.length == 1){
          this.idMagasin = this.magasins[0].id;
          this.changeMagasin();
        }
      },
      this.magasinService.onError
    )
  }

  changeMagasin(){
    this.idCaisse = "";
    if(this.idMagasin)
      this.magasin = this.magasins.find((r)=> r.id == this.idMagasin);
  }

  changeDate({dateDebut, dateFin}){
    this.debut = dateDebut;
    this.fin = dateFin;
  }

  rechercher(){
    this.onSearch.emit({
      fin: this.fin,
      debut: this.debut,
      magasin: this.magasin,
      code: this.code
    });
  }

  changeCode(code){
    if(typeof(code) != "string")
      return;
    this.code = code;
  }

}

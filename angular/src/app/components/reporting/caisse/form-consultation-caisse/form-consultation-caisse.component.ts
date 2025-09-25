import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { SearchTicketCaisse } from '../interface';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-consultation-caisse',
  templateUrl: './form-consultation-caisse.component.html',
  styleUrls: ['./form-consultation-caisse.component.scss']
})
export class FormConsultationCaisseComponent implements OnInit {

  magasins;
  idMagasin = "";
  magasin;
  idCaisse;
  fin = "";
  debut = "";
  client = "";
  showClient = false;

  @Output() onSearch  = new EventEmitter<SearchTicketCaisse>();

  @Input() filtreClient = true;
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
    const caisse = this.magasin.caisses.find((r)=> r.id == this.idCaisse);
    this.onSearch.emit({
      fin: this.fin, 
      debut: this.debut, 
      caisse: caisse,
      magasin: this.magasin.nommagasin,
      magasinObj: this.magasin,
      client: this.client
    });    
  }

  setShowOption(){
    this.showClient = !this.showClient;
    this.client = "";
  }
}

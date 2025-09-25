import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MagasinService } from '../../../services/magasin.service';

@Component({
  selector: 'app-form-monnaie',
  templateUrl: './form-monnaie.component.html',
  styleUrls: ['./form-monnaie.component.scss']
})
export class FormMonnaieComponent implements OnInit {

  @Input() monnaies;

  monnaie = 0;
  valeur = 0;
  libelle;

  paramsMonnaies: any[];
  

  constructor(
    private notif: NotificationService,
    private magasinService: MagasinService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.initializeParamsMonnaies();
  }

  addMonnaie(){
    if(isNaN(this.monnaie) || this.monnaie <= 0)
      return this.notif.error("Veuillez renseigner un montant positif");
    if(isNaN(this.valeur) || this.valeur <= 0)
      return this.notif.error("Veuillez renseigner une valeur positive");
    if(!this.libelle)
      return this.notif.error("Veuillez renseigner le libellé de la monnaie");
    const montant = this.monnaie;
    const exist = this.monnaies.monnaie.find((r)=> r.lib == this.libelle && montant == r.montant);
    
    if(exist)
      return this.notif.error("Cette monnaie est déjà ajoutée");
    this.monnaies.monnaie.push({montant: montant, lib: this.libelle, valeur: this.valeur});
  }

  initializeParamsMonnaies(){
    this.magasinService.getMonnaies().subscribe(
      (r)=> this.paramsMonnaies = r,
      this.magasinService.onError
    )
  }

  
  deleteMonnaie(i){
    this.monnaies.monnaie.splice(i, 1);
  }
}

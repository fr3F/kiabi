import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-form-horaire-ouvrable',
  templateUrl: './form-horaire-ouvrable.component.html',
  styleUrls: ['./form-horaire-ouvrable.component.scss']
})
export class FormHoraireOuvrableComponent implements OnInit {

  @Input() horaireouvrable;

  libelle = "";
  valeur = "";

  constructor(
    private notif: NotificationService
  ) { }

  ngOnInit(
  ): void {
  }

  add(){
    if(!this.libelle)
      return this.notif.error("Veuillez renseigner le libellé");
    if(!this.valeur)
      return this.notif.error("Veuillez renseigner la valeur");
    const exist = this.horaireouvrable.horaire.find((r)=> r.libelle == this.libelle);
    if(exist)
      return this.notif.error("Cet horaire est déjà ajouté");
    this.push();
  }

  push(){ // Push element to horaire
    const element = {
      libelle: this.libelle,
      valeur: this.valeur
    }
    this.horaireouvrable.horaire.push(element);
    this.libelle = "";
    this.valeur = "";
  }

  
  delete(i){
    this.horaireouvrable.horaire.splice(i, 1);
  }

}

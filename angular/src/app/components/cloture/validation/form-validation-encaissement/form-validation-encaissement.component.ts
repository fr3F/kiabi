import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EncaissementService } from './../../../../services/cloture/encaissement.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-form-validation-encaissement',
  templateUrl: './form-validation-encaissement.component.html',
  styleUrls: ['./form-validation-encaissement.component.scss']
})
export class FormValidationEncaissementComponent implements OnInit {

  @Input() id;
  @Input() acces;

  @Output() onValidate = new EventEmitter();

  encaissement;
  totalReglement;
  montantEspece = 0;

  motif = "";
  ecart; 
  especeRecu;

  @ViewChild("modalEcart") modalEcartEl: ElementRef

  constructor(
    private encaissementService: EncaissementService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initializeEncaissement();
  }

  initializeEncaissement(){
    this.encaissementService.getDetailValider(this.id).subscribe(
      (r)=> {
        this.encaissement = r;
        this.setTotalReglement();
      },
      this.encaissementService.onError
    )
  }

  setTotalReglement(){
    this.totalReglement = 0;
    for(let reglement of this.encaissement.reglements){
      this.totalReglement += reglement.montant;
      if(reglement.modepaiement == "Espèces")
        this.montantEspece =  reglement.montant;
    }
  }

  verifierEcart(){
    if(isNaN(parseFloat(this.especeRecu)) || this.especeRecu<0){
      this.encaissementService.notif.error("Veuillez renseigner un montant reçu positif ou null");
      return;
    }
    if(this.montantEspece == this.especeRecu)
      this.valider()
    else
      this.modalService.open(this.modalEcartEl);
  }

  valider(){
    if(this.montantEspece != this.especeRecu && !this.motif){
      this.encaissementService.notif.error("Veuillez renseigner le motif de l'écart");
      return;
    }
    this.encaissementService.valider(this.encaissement.idencaissement, this.motif, this.especeRecu).subscribe(
      (r)=>{
        this.onValidate.emit();
        this.encaissementService.notif.success("Validé");
        this.modalService.dismissAll();    
      },
      this.encaissementService.onError
    )
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-gamme-produit',
  templateUrl: './gamme-produit.component.html',
  styleUrls: ['./gamme-produit.component.scss']
})
export class GammeProduitComponent extends BarcodeProduitComponent {

  @Output() afficherGamme = new EventEmitter<boolean>();

  refreshData(){
    this.subscription$ = this.produitService.getGammes(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

  onSuccess = (r: any[])=>{
    this.data = r;
    console.log(r)
    this.afficherGamme.emit(this.data.length != 0);
    this.loading = false;
  }

}


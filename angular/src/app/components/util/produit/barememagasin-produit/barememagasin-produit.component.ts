import { Component, Input, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-barememagasin-produit',
  templateUrl: './barememagasin-produit.component.html',
  styleUrls: ['./barememagasin-produit.component.scss']
})
export class BarememagasinProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getBaremesPourcentages(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }
  afficherFin(item){
    return new Date(item.TF_Fin).getFullYear() != 1900
  }
}

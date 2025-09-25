import { Component, Input, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-remisemagasin-produit',
  templateUrl: './remisemagasin-produit.component.html',
  styleUrls: ['./remisemagasin-produit.component.scss']
})
export class RemisemagasinProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getRemiseMagasins(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

}

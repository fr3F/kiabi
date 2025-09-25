import { Component, Input, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-tarifmagasin-produit',
  templateUrl: './tarifmagasin-produit.component.html',
  styleUrls: ['./tarifmagasin-produit.component.scss']
})
export class TarifmagasinProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getTarifMagasins(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

}

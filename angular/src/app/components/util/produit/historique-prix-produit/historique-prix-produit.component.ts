import { Component, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-historique-prix-produit',
  templateUrl: './historique-prix-produit.component.html',
  styleUrls: ['./historique-prix-produit.component.scss']
})
export class HistoriquePrixProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getHistoriquePrix(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }
}

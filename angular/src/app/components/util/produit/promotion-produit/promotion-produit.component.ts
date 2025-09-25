import { Component, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-promotion-produit',
  templateUrl: './promotion-produit.component.html',
  styleUrls: ['./promotion-produit.component.scss']
})
export class PromotionProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getItemPromotions(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

  
  onSuccess = (r: any[])=>{
    this.data = r;
    this.setItemPromotion();
    this.loading = false;
  }

  setItemPromotion(){
    for(const item of this.data){
      if(item.promotion.typePromotion == "Montant")
        item.currency = this.devise;
      else
        item.currency = "%";

      item.expire = new Date() > new Date(item.promotion.datefin);
    }
  }
}

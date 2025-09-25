import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-stock-produit',
  templateUrl: './stock-produit.component.html',
  styleUrls: ['./stock-produit.component.scss']
})
export class StockProduitComponent extends BarcodeProduitComponent {

  @Input() magasin = false;
  @Input() titleClass = "";
  @Input() tableClass = "table-secondary";

  depots: string[];
  withGamme = false;

  refreshData(){
    let observable = this.produitService.getStocks(this.code);
    if(this.magasin)
      observable = this.produitService.getStockMagasins(this.code);
    this.subscription$ = observable.subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
      if(changes.code.currentValue != changes.code.previousValue)
        this.refreshData();
  }

  onSuccess = (r: any[])=>{
    this.data = r;
    this.setDepots();
    this.setWithGamme();
    this.loading = false;
  }
  
  setDepots(){
    const duplicate = this.data.map((r)=> r.depot);
    this.depots = Array.from(new Set(duplicate));
  }

  setWithGamme(){
    for(const item of this.data){
      if(item.gamme){
        this.withGamme = true;
        return;
      }
    }
    this.withGamme = false;
  }

}

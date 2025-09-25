import { Component, Input, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-article-ticket-produit',
  templateUrl: './article-ticket-produit.component.html',
  styleUrls: ['./article-ticket-produit.component.scss']
})
export class ArticleTicketProduitComponent extends BarcodeProduitComponent {

  refreshData(){
    this.subscription$ = this.produitService.getArticleTickets(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { BarcodeProduitComponent } from '../../barcode/barcode-produit/barcode-produit.component';

@Component({
  selector: 'app-article-offert-produit',
  templateUrl: './article-offert-produit.component.html',
  styleUrls: ['./article-offert-produit.component.scss']
})
export class ArticleOffertProduitComponent extends BarcodeProduitComponent {


  refreshData(){
    this.subscription$ = this.produitService.getArticleOfferts(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

  openCreate(modal){
    this.modalService.open(modal, {size: "md"});
  }

  onCreate($event){
    // this.data.push($event);
    this.refreshData();
    this.modalService.dismissAll();
  }

  onSuccess = (r: any[])=>{
    this.data = r;
    for(const item of this.data){
      item.expire = new Date() >= new Date(item.fin);
    }
    this.loading = false;
  }

  deleteArticleOffert(i){
    this.produitService.deleteArticleOffert(this.data[i].id).subscribe(
      (r)=>{
        this.produitService.notif.info("Supprimé");
        this.data.splice(i, 1);
      },
      this.produitService.onError
    )
  }
}

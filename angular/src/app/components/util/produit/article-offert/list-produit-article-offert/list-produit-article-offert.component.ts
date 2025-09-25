import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';

@Component({
  selector: 'app-list-produit-article-offert',
  templateUrl: './list-produit-article-offert.component.html',
  styleUrls: ['./list-produit-article-offert.component.scss']
})
export class ListProduitArticleOffertComponent extends BaseListComponent {

  ngOnInit(): void {
      super.ngOnInit();
      // for(const produit of this.list){
      //   for(const item of produitarticleOfferts){
      //     item.expire = new Date() >= new Date(item.fin);
      //   }
      // }
  }

  showDetail(item){
    item.detail = !item.detail; 
  }

  getClassDetail(item){
    if(item.detail)
      return "fa-angle-up";
    return "fa-angle-down";
  }
}

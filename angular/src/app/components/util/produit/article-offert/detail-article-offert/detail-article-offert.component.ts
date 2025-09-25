import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProduitService } from 'src/app/services/utils/produit.service';

@Component({
  selector: 'app-detail-article-offert',
  templateUrl: './detail-article-offert.component.html',
  styleUrls: ['./detail-article-offert.component.scss']
})
export class DetailArticleOffertComponent implements OnInit {

  @Input() magasin;
  @Input() code;

  list$: Observable<any[]>;

  constructor(
    private produitService: ProduitService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(){
    this.list$ = this.produitService.getArticleOffertsProduitMagasin(this.code, this.magasin)
  }

  expire(item){
    return new Date() >= new Date(item.fin);
  }
}

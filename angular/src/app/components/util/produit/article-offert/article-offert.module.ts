import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailArticleOffertComponent } from './detail-article-offert/detail-article-offert.component';
import { ListProduitArticleOffertComponent } from './list-produit-article-offert/list-produit-article-offert.component';
import { FormArticleOffertComponent } from './form-article-offert/form-article-offert.component';
import { ArticleOffertProduitComponent } from './article-offert-produit/article-offert-produit.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ListMontantArticleOffertComponent } from './montant/list-montant-article-offert/list-montant-article-offert.component';
import { FormMontantArticleOffertComponent } from './montant/form-montant-article-offert/form-montant-article-offert.component';
import { AddOfferedArticleComponent } from './montant/add-offered-article/add-offered-article.component';
import { OfferedArticlesListComponent } from './montant/offered-articles-list/offered-articles-list.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    ArticleOffertProduitComponent,
    FormArticleOffertComponent,
    ListProduitArticleOffertComponent,
    DetailArticleOffertComponent,
    ListMontantArticleOffertComponent,
    FormMontantArticleOffertComponent,
    AddOfferedArticleComponent,
    OfferedArticlesListComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    RouterModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetModule,
    NgxLoadingModule,
    PipeModule,
    NgbTooltipModule
  ],
  exports: [
    ArticleOffertProduitComponent,
    FormArticleOffertComponent,
    ListProduitArticleOffertComponent,
    DetailArticleOffertComponent,
    ListMontantArticleOffertComponent

  ]
})
export class ArticleOffertModule { }

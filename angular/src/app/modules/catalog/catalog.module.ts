import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { ListCatalogPageComponent } from './pages/list-catalog-page/list-catalog-page.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FiltreClsComponent } from './components/list/filtre-cls/filtre-cls.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { ListCatalogComponent } from './components/list/list-catalog/list-catalog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { CatalogCardComponent } from './components/list/catalog-card/catalog-card.component';
import { DetailCatalogComponent } from './components/list/detail-catalog/detail-catalog.component';


@NgModule({
  declarations: [
    ListCatalogPageComponent,
    FiltreClsComponent,
    ListCatalogComponent,
    CatalogCardComponent,
    DetailCatalogComponent
  ],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    UIModule,
    FormsModule,
    NgxSpinnerModule,
    MatTreeModule,
    MatIconModule,
    NgxPaginationModule,
    NgxLoadingModule
  ]
})
export class CatalogModule { }

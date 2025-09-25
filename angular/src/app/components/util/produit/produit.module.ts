import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoProduitComponent } from './info-produit/info-produit.component';
import { BarcodeProduitComponent } from './barcode/barcode-produit/barcode-produit.component';
import { TarifmagasinProduitComponent } from './tarifmagasin-produit/tarifmagasin-produit.component';
import { RemisemagasinProduitComponent } from './remisemagasin-produit/remisemagasin-produit.component';
import { BarememagasinProduitComponent } from './barememagasin-produit/barememagasin-produit.component';
import { StockProduitComponent } from './stock-produit/stock-produit.component';
import { GammeProduitComponent } from './gamme-produit/gamme-produit.component';
import { ArticleTicketProduitComponent } from './article-ticket-produit/article-ticket-produit.component';
import { NgxLoadingModule } from 'ngx-loading';
import { PromotionProduitComponent } from './promotion-produit/promotion-produit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { FormBarcodeComponent } from './barcode/form-barcode/form-barcode.component';
import { HistoriquePrixProduitComponent } from './historique-prix-produit/historique-prix-produit.component';
import { PrintBarcodeComponent } from './barcode/print-barcode/print-barcode.component';
import { StockWithGammesComponent } from './stock-produit/stock-with-gammes/stock-with-gammes.component';
import { StockWithoutGammesComponent } from './stock-produit/stock-without-gammes/stock-without-gammes.component';



@NgModule({
  declarations: [
    InfoProduitComponent,
    BarcodeProduitComponent,
    TarifmagasinProduitComponent,
    RemisemagasinProduitComponent,
    BarememagasinProduitComponent,
    StockProduitComponent,
    GammeProduitComponent,
    ArticleTicketProduitComponent,
    PromotionProduitComponent,
    FormBarcodeComponent,
    HistoriquePrixProduitComponent,
    PrintBarcodeComponent,
    StockWithGammesComponent,
    StockWithoutGammesComponent,
  ],
  imports: [
    CommonModule,
    NgxLoadingModule,
    FormsModule,
    ReactiveFormsModule,
    WidgetModule,
    NgbModalModule,
    NgxSpinnerModule,
    NgbPaginationModule,
    NgxPaginationModule,
    RouterModule,
    PipeModule,
    NgbTooltipModule
  ],
  exports: [
    InfoProduitComponent,
    BarcodeProduitComponent,
    TarifmagasinProduitComponent,
    RemisemagasinProduitComponent,
    BarememagasinProduitComponent,
    StockProduitComponent,
    GammeProduitComponent,
    ArticleTicketProduitComponent,
    PromotionProduitComponent,
    HistoriquePrixProduitComponent


  ]
})
export class ProduitModule { }

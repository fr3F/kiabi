import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormReportingComponent } from './form-reporting/form-reporting.component';
import { FormsModule } from '@angular/forms';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { ReportingArticleTicketComponent } from './reporting-article-ticket/reporting-article-ticket.component';
import { ControlMagasinComponent } from './control/control-magasin/control-magasin.component';
import { ControlCaisseComponent } from './control/control-caisse/control-caisse.component';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormAnalyseVenteComponent } from './analyse/form-analyse-vente/form-analyse-vente.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ListAnalyseVenteComponent } from './analyse/list-analyse-vente/list-analyse-vente.component';
import { RecapReportingTicketComponent } from './recap-reporting-ticket/recap-reporting-ticket.component';
import { FormConsultationArticleComponent } from './consultation-article/form-consultation-article/form-consultation-article.component';
import { DetailConsultationArticleComponent } from './consultation-article/detail-consultation-article/detail-consultation-article.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConsultationStockComponent } from './consultation-article/consultation-stock/consultation-stock.component';
import { ListReglementComponent } from './control/list-reglement/list-reglement.component';
import { ControlSynchroComponent } from './control/control-synchro/control-synchro.component';
import { FormControlCaisseComponent } from './control/form-control-caisse/form-control-caisse.component';
import { ConsultationStocksComponent } from './consultation-article/consultation-stocks/consultation-stocks.component';
import { FormConsultationCaisseComponent } from './caisse/form-consultation-caisse/form-consultation-caisse.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { FormReportingReglementComponent } from './reglement/form-reporting-reglement/form-reporting-reglement.component';
import { ListReglementReportingComponent } from './reglement/list-reglement-reporting/list-reglement-reporting.component';
import { FormConsultationCaisseCodeComponent } from './caisse/form-consultation-caisse-code/form-consultation-caisse-code.component';
import { ListArticleTicketCaisseCodeComponent } from './caisse/list-article-ticket-caisse-code/list-article-ticket-caisse-code.component';
// import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { FormReportingArticleComponent } from './article/form-reporting-article/form-reporting-article.component';
import { ListReportingArticleComponent } from './article/list-reporting-article/list-reporting-article.component';
import { RouterModule } from '@angular/router';
import { ListBarcodeComponent } from './article/list-barcode/list-barcode.component';
import { ListVentesArticleComponent } from './consultation-article/list-ventes-article/list-ventes-article.component';



@NgModule({
  declarations: [
    FormReportingComponent,
    ReportingArticleTicketComponent,
    ControlMagasinComponent,
    ControlCaisseComponent,
    FormAnalyseVenteComponent,
    ListAnalyseVenteComponent,
    RecapReportingTicketComponent,
    FormConsultationArticleComponent,
    DetailConsultationArticleComponent,
    ConsultationStockComponent,
    ListReglementComponent,
    ControlSynchroComponent,
    FormControlCaisseComponent,
    ConsultationStocksComponent,
    FormConsultationCaisseComponent,
    FormReportingReglementComponent,
    ListReglementReportingComponent,
    FormConsultationCaisseCodeComponent,
    FormReportingArticleComponent,
    ListReportingArticleComponent,
    ListBarcodeComponent,
    ListVentesArticleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    WidgetModule,
    NgbModalModule,
    NgxPaginationModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    WidgetModule,
    NgbTooltipModule,
    PipeModule,
    // VirtualScrollerModule,
    RouterModule
  ],
  exports: [
    FormReportingComponent,
    ReportingArticleTicketComponent,
    ControlMagasinComponent,
    FormAnalyseVenteComponent,
    ListAnalyseVenteComponent,
    FormConsultationArticleComponent,
    DetailConsultationArticleComponent,
    ConsultationStockComponent,
    ControlSynchroComponent,
    FormControlCaisseComponent,
    ConsultationStocksComponent,
    FormConsultationCaisseComponent,
    FormReportingReglementComponent,
    ListReglementReportingComponent,
    FormConsultationCaisseCodeComponent,
    FormReportingArticleComponent,
    ListReportingArticleComponent,

  ],
  providers: [DatePipe]

})
export class ReportingModule { }

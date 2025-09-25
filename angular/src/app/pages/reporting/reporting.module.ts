import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingPageComponent } from './reporting-page/reporting-page.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ReportingModule } from 'src/app/components/reporting/reporting.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ControlePageComponent } from './controle-page/controle-page.component';
import { TransfertSageModule } from 'src/app/components/cloture/transfert-sage/transfert-sage.module';
import { AnalyseVentePageComponent } from './analyse-vente-page/analyse-vente-page.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConsultationArticleComponent } from './consultation-article/consultation-article.component';
import { ControleSynchroPageComponent } from './controle-synchro-page/controle-synchro-page.component';
import { FormsModule } from '@angular/forms';
import { LogCaissePageComponent } from './log-caisse-page/log-caisse-page.component';
import { LogCaisseModule } from 'src/app/components/caisse/log-caisse/log-caisse.module';
import { ControleSynchroCaissePageComponent } from './controle-synchro-caisse-page/controle-synchro-caisse-page.component';
import { ConsultationCaissePageComponent } from './consultation-caisse-page/consultation-caisse-page.component';
import { ConsultationTicketPageComponent } from './consultation-ticket-page/consultation-ticket-page.component';
import { ReglementPageComponent } from './reglement-page/reglement-page.component';
import { ConsultationStockPageComponent } from './consultation-stock-page/consultation-stock-page.component';
import { ConsultationStockModule } from 'src/app/components/reporting/consultation-stock/consultation-stock.module';
import { ConsultationCaisseCodePageComponent } from './consultation-caisse-code-page/consultation-caisse-code-page.component';
import { TicketModule } from 'src/app/components/reporting/caisse/ticket/ticket.module';
import { ReportingArticlePageComponent } from './reporting-article-page/reporting-article-page.component';
import { UserModuleComponent } from "../../components/user/user.module";
import { ProduitModule } from 'src/app/components/util/produit/produit.module';


@NgModule({
  declarations: [
    ReportingPageComponent,
    ControlePageComponent,
    AnalyseVentePageComponent,
    ConsultationArticleComponent,
    ControleSynchroPageComponent,
    LogCaissePageComponent,
    ControleSynchroCaissePageComponent,
    ConsultationCaissePageComponent,
    ConsultationTicketPageComponent,
    ReglementPageComponent,
    ConsultationStockPageComponent,
    ConsultationCaisseCodePageComponent,
    ReportingArticlePageComponent
  ],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    UIModule,
    ReportingModule,
    NgxSpinnerModule,
    TransfertSageModule,
    NgbPaginationModule,
    NgxPaginationModule,
    FormsModule,
    LogCaisseModule,
    ConsultationStockModule,
    TicketModule,
    UserModuleComponent,
    ProduitModule
],
  providers: [DatePipe]
})
export class ReportingPageModule { }

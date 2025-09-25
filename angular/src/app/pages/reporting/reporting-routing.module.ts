import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportingPageComponent } from './reporting-page/reporting-page.component';
import { ControlePageComponent } from './controle-page/controle-page.component';
import { AnalyseVentePageComponent } from './analyse-vente-page/analyse-vente-page.component';
import { ConsultationCaissePageComponent } from './consultation-caisse-page/consultation-caisse-page.component';
import { ConsultationTicketPageComponent } from './consultation-ticket-page/consultation-ticket-page.component';
import { ReglementPageComponent } from './reglement-page/reglement-page.component';
import { ConsultationStockPageComponent } from './consultation-stock-page/consultation-stock-page.component';
import { ConsultationCaisseCodePageComponent } from './consultation-caisse-code-page/consultation-caisse-code-page.component';
import { ReportingArticlePageComponent } from './reporting-article-page/reporting-article-page.component';

const routes: Routes = [
  {
    path: "tickets",
    component: ReportingPageComponent,
  },
  {
    path: "controle-ticket",
    component: ControlePageComponent,
  },
  {
    path: "analyse-ventes",
    component: AnalyseVentePageComponent,
  },
  {
    path: "consultation-caisse",
    component: ConsultationCaissePageComponent,
  }, 
  {
    path: "consultation-article-caisse",
    component: ConsultationCaisseCodePageComponent,
  },
  {
    path: "consultation-tickets",
    component: ConsultationTicketPageComponent,
  },
  {
    path: "consultation-stocks",
    component: ConsultationStockPageComponent,
  },
  {
    path: "reglements",
    component: ReglementPageComponent,
  }, 
  {
    path: "articles",
    component: ReportingArticlePageComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportingRoutingModule { }

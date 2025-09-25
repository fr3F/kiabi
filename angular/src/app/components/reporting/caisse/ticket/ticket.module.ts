import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListArticleTicketCaisseComponent } from '../list-article-ticket-caisse/list-ticket-caisse.component';
import { ListTicketCaisseComponent } from './list-ticket-caisse/list-ticket-caisse.component';
import { InfoTicketComponent } from './detail/info-ticket/info-ticket.component';
import { ArticlesTicketComponent } from './detail/articles-ticket/articles-ticket.component';
import { ReglementsTicketComponent } from './detail/reglements-ticket/reglements-ticket.component';
import { DetailsTicketComponent } from './detail/details-ticket/details-ticket.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { FormsModule } from '@angular/forms';
import { TableArticleTicketCaisseComponent } from '../table-article-ticket-caisse/table-article-ticket-caisse.component';
import { ListArticleTicketCaisseCodeComponent } from '../list-article-ticket-caisse-code/list-article-ticket-caisse-code.component';



@NgModule({
  declarations: [
    ListArticleTicketCaisseComponent,
    ListTicketCaisseComponent,
    InfoTicketComponent,
    ArticlesTicketComponent,
    ReglementsTicketComponent,
    DetailsTicketComponent,
    TableArticleTicketCaisseComponent,
    ListArticleTicketCaisseCodeComponent,
  ],
  imports: [
    CommonModule,
    PipeModule,
    FormsModule
  ],
  exports: [
    ListArticleTicketCaisseComponent,
    ListTicketCaisseComponent,
    ListArticleTicketCaisseCodeComponent,
    InfoTicketComponent,
    ArticlesTicketComponent,
    ReglementsTicketComponent,
    
  ]
})
export class TicketModule { }

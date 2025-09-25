import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailTicketBtnComponent } from './detail/detail-ticket-btn/detail-ticket-btn.component';
import { DetailTicketComponent } from './detail/detail-ticket/detail-ticket.component';
import { ArticlesTicketComponent } from './detail/articles-ticket/articles-ticket.component';
import { ReglementsTicketComponent } from './detail/reglements-ticket/reglements-ticket.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InfoTicketComponent } from './detail/info-ticket/info-ticket.component';
import { LoyaltyTicketComponent } from './detail/loyalty-ticket/loyalty-ticket.component';
import { PipeModule } from 'src/app/pipe/pipe.module';



@NgModule({
  declarations: [
    DetailTicketBtnComponent,
    DetailTicketComponent,
    ArticlesTicketComponent,
    ReglementsTicketComponent,
    InfoTicketComponent,
    LoyaltyTicketComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    NgxSpinnerModule,
    PipeModule
  ],
  exports: [
    DetailTicketBtnComponent,
  ]
})
export class TicketModule { }

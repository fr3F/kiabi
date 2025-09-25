import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { SalesPageComponent } from './pages/sales-page/sales-page.component';
import { FormSalesComponent } from './components/form-sales/form-sales.component';
import { FormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ListTicketsComponent } from './components/list-tickets/list-tickets.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { SendSalesComponent } from './components/action/send-sales/send-sales.component';
import { TicketModule } from './components/ticket/ticket.module';


@NgModule({
  declarations: [
    SalesPageComponent,
    FormSalesComponent,
    ListTicketsComponent,
    SendSalesComponent
  ],
  imports: [
    CommonModule,
    SaleRoutingModule,
    FormsModule,
    UIModule,
    NgxSpinnerModule,
    PipeModule,
    TicketModule
  ]
})
export class SaleModule { }

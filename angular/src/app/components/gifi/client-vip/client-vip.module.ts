import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormClientVipComponent } from './form-client-vip/form-client-vip.component';
import { ListClientVipComponent } from './list-client-vip/list-client-vip.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { RouterModule } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReportingClientVipComponent } from './reporting-client-vip/reporting-client-vip.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { CarteVipModalComponent } from './carte-vip-modal/carte-vip-modal.component';
import { HistoriqueConsoComponent } from './historique-conso/historique-conso.component';
import { ActiverCarteComponent } from './activer-carte/activer-carte.component';
import { ListTicketToRegularizeComponent } from './regularisation-point/list-ticket-to-regularize/list-ticket-to-regularize.component';
import { SendClientKiabiComponent } from './send-client-kiabi/send-client-kiabi.component';
import { LoyactModule } from 'src/app/modules/marketing/loyact/loyact.module';



@NgModule({
  declarations: [
    FormClientVipComponent,
    ListClientVipComponent,
    ReportingClientVipComponent,
    CarteVipModalComponent,
    HistoriqueConsoComponent,
    ActiverCarteComponent,
    ListTicketToRegularizeComponent,
    SendClientKiabiComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    NgxLoadingModule,
    RouterModule,
    NgxMaskModule.forRoot(),
    NgxSpinnerModule,
    PipeModule,
    NgbTooltipModule,
    NgbModalModule,
    LoyactModule

  ],
  exports: [
    FormClientVipComponent,
    ListClientVipComponent,
    ReportingClientVipComponent,
    HistoriqueConsoComponent

  ],
  providers: [DatePipe]
})
export class ClientVipComponentModule { }

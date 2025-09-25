import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyactActionComponent } from './components/loyact-action/loyact-action.component';
import { TicketRecoveryComponent } from './components/action/ticket-recovery/ticket-recovery.component';
import { AnniversaryPointsComponent } from './components/action/anniversary-points/anniversary-points.component';
import { BirthPointsComponent } from './components/action/birth-points/birth-points.component';
import { WelcomePackComponent } from './components/action/welcome-pack/welcome-pack.component';
import { MarketingOperationComponent } from './components/action/marketing-operation/marketing-operation.component';
import { CardTransfertComponent } from './components/action/card-transfert/card-transfert.component';
import { CardBlockingComponent } from './components/action/card-blocking/card-blocking.component';
import {
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoyactActionComponent,
    TicketRecoveryComponent,
    AnniversaryPointsComponent,
    BirthPointsComponent,
    WelcomePackComponent,
    MarketingOperationComponent,
    CardTransfertComponent,
    CardBlockingComponent
  ],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbModalModule,
    NgbTooltipModule,
    ReactiveFormsModule
  ],
  exports: [
    LoyactActionComponent
  ]
})
export class LoyactModule { }

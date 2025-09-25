import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTransfertSageComponent } from './form-transfert-sage/form-transfert-sage.component';
import { FormsModule } from '@angular/forms';
import { ListARegulariserComponent } from './list-aregulariser/list-aregulariser.component';
import { ResumeJourComponent } from './resume-jour/resume-jour.component';
import { SommaireReglementComponent } from './sommaire-reglement/sommaire-reglement.component';
import { RouterModule } from '@angular/router';
import { DetailTicketMagasinComponent } from './detail-ticket-magasin/detail-ticket-magasin.component';
import { PipeModule } from 'src/app/pipe/pipe.module';



@NgModule({
  declarations: [
    FormTransfertSageComponent,
    ListARegulariserComponent,
    ResumeJourComponent,
    SommaireReglementComponent,
    DetailTicketMagasinComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PipeModule
  ],
  exports: [
    FormTransfertSageComponent,
    ListARegulariserComponent,
    ResumeJourComponent,
    SommaireReglementComponent,
    DetailTicketMagasinComponent

  ]
})
export class TransfertSageModule { }

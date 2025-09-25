import { TransfertSageModule } from './../../components/cloture/transfert-sage/transfert-sage.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClotureRoutingModule } from './cloture-routing.module';
import { ImportSagePageComponent } from './import-sage-page/import-sage-page.component';
import { ValidationPageComponent } from './validation-page/validation-page.component';
import { ValidationModule } from 'src/app/components/cloture/validation/validation.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DetailTicketMagasinPageComponent } from './detail-ticket-magasin-page/detail-ticket-magasin-page.component';
import { ParametragePageComponent } from './parametrage-page/parametrage-page.component';
import { ParametrageModule } from 'src/app/components/cloture/parametrage/parametrage.module';


@NgModule({
  declarations: [
    ImportSagePageComponent,
    ValidationPageComponent,
    DetailTicketMagasinPageComponent,
    ParametragePageComponent
  ],
  imports: [
    CommonModule,
    ClotureRoutingModule,
    ValidationModule,
    UIModule,
    TransfertSageModule,
    NgxSpinnerModule,
    ParametrageModule
  ]
})
export class ClotureModule { }

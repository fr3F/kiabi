import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { ListEncaissementValidationComponent } from './list-encaissement-validation/list-encaissement-validation.component';
import { FormsModule } from '@angular/forms';
import { FormValidationEncaissementComponent } from './form-validation-encaissement/form-validation-encaissement.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ListReglementsComponent } from './detail/list-reglements/list-reglements.component';
import { ListBilletageComponent } from './detail/list-billetage/list-billetage.component';
import { ImprimerReglementComponent } from './detail/imprimer-reglement/imprimer-reglement.component';
import { PipeModule } from 'src/app/pipe/pipe.module';



@NgModule({
  declarations: [
    FormValidationComponent,
    ListEncaissementValidationComponent,
    FormValidationEncaissementComponent,
    ListReglementsComponent,
    ListBilletageComponent,
    ImprimerReglementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    NgxSpinnerModule,
    PipeModule
  ],
  exports: [
    FormValidationComponent,
    ListEncaissementValidationComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ValidationModule { }

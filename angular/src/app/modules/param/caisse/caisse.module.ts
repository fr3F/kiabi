import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CaisseRoutingModule } from './caisse-routing.module';
import { ListCaisseComponent } from './components/list-caisse/list-caisse.component';
import { FormCaisseComponent } from './components/form-caisse/form-caisse.component';
import { ListEncaissementCaisseComponent } from './components/list-encaissement-caisse/list-encaissement-caisse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PipeModule } from 'src/app/pipe/pipe.module';


@NgModule({
  declarations: [
    ListCaisseComponent,
    FormCaisseComponent,
    ListEncaissementCaisseComponent
  ],
  imports: [
    CommonModule,
    CaisseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgxSpinnerModule,
    NgbModalModule,
    PipeModule
  ],
  exports: [
    ListCaisseComponent,
    FormCaisseComponent
  ]
})
export class CaisseModule { }

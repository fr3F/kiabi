import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormParametrageComponent } from './form-parametrage/form-parametrage.component';
import { ListParametrageComponent } from './list-parametrage/list-parametrage.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FormParametrageComponent,
    ListParametrageComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    FormParametrageComponent,
    ListParametrageComponent
  ]
})
export class ParametrageModule { }

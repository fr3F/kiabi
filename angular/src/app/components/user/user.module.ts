import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list/list.component';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { FormAccesComponent } from './acces/form-acces/form-acces.component';



@NgModule({
  declarations: [
    FormComponent,
    ListComponent,
    FormAccesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgxPaginationModule,
    RouterModule,
    NgbDropdownModule,
    NgbTooltipModule
  ],
  exports: [
    FormComponent,
    ListComponent,
    FormAccesComponent
  ]
})
export class UserModuleComponent { }

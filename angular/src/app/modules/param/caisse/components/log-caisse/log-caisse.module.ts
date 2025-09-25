import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormLogCaisseComponent } from './form-log-caisse/form-log-caisse.component';
import { DetailLogCaisseComponent } from './detail-log-caisse/detail-log-caisse.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FormLogCaisseComponent,
    DetailLogCaisseComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    FormLogCaisseComponent,
    DetailLogCaisseComponent

  ]
})
export class LogCaisseModule { }

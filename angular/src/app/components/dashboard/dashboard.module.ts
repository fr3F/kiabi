import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIModule } from 'src/app/shared/ui/ui.module';
// import { ProduitComponent } from './produit/produit.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import {  LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormDateComponent } from './form-date/form-date.component';




@NgModule({
  declarations: [
    FormDateComponent
  ],
  imports: [
    CommonModule,
    WidgetModule,
    FormsModule
  ],
  exports: [
    FormDateComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

})
export class DashboardComponentModule { }

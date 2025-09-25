import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListConsultationStockComponent } from './list-consultation-stock/list-consultation-stock.component';
import { FormConsultationStockComponent } from './form-consultation-stock/form-consultation-stock.component';
import { StockAutreDepotsComponent } from './stock-autre-depots/stock-autre-depots.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListConsultationStockComponent,
    FormConsultationStockComponent,
    StockAutreDepotsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    FormConsultationStockComponent,
    ListConsultationStockComponent,

  ]
})
export class ConsultationStockModule { }

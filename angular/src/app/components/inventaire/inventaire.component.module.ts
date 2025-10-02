import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    NgApexchartsModule ,
  ],
  exports: []
})
export class InventaireComponentModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModalModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { StatComponent } from './stat/stat.component';
import { TransactionComponent } from './transaction/transaction.component';
import { FormsModule } from '@angular/forms';
import { SearchDateComponent } from './search-date/search-date.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from 'src/app/core/helpers/jwt.interceptor';
import { ErrorInterceptor } from 'src/app/core/helpers/error.interceptor';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SellingchartComponent } from './sellingchart/sellingchart.component';
import { FormPeriode2Component } from './form-periode2/form-periode2.component';
import { FormPeriodeComponent } from './form-periode/form-periode.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { ListSearchComponent } from './list-search/list-search.component';
import { EcartComponent } from './ecart/ecart.component';

@NgModule({
  declarations: [StatComponent, TransactionComponent, SearchDateComponent, AutocompleteComponent,
    SellingchartComponent,
    FormPeriode2Component, FormPeriodeComponent, HistoriquesComponent,
    ListSearchComponent,
    EcartComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    NgbTypeaheadModule,
    NgApexchartsModule
  ],
  exports: [
    StatComponent, TransactionComponent, SearchDateComponent, AutocompleteComponent,
    SellingchartComponent,
    FormPeriode2Component, FormPeriodeComponent,
    HistoriquesComponent,
    FormsModule,
    ListSearchComponent,
    EcartComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    
  ]
})
export class WidgetModule { }

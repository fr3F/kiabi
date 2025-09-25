import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTransfertRoutingModule } from './data-transfert-routing.module';
import { DataTransfertPageComponent } from './pages/data-transfert-page/data-transfert-page.component';
import { ListHistoriesComponent } from './components/list-histories/list-histories.component';
import { UpdateDataComponent } from './components/action/update-data/update-data.component';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [
    DataTransfertPageComponent,
    ListHistoriesComponent,
    UpdateDataComponent
  ],
  imports: [
    CommonModule,
    DataTransfertRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    UIModule,
    NgxLoadingModule
  ]
})
export class DataTransfertModule { }

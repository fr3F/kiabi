import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModePaiementRoutingModule } from './mode-paiement-routing.module';
import { ListModePaiementComponent } from './components/list-mode-paiement/list-mode-paiement.component';
import { FormModePaiementComponent } from './components/form-mode-paiement/form-mode-paiement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule } from 'ngx-loading';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { ModePaiementListPageComponent } from './pages/mode-paiement-list-page/mode-paiement-list-page.component';


@NgModule({
  declarations: [
    ListModePaiementComponent,
    FormModePaiementComponent,
    ModePaiementListPageComponent
  ],
  imports: [
    CommonModule,
    ModePaiementRoutingModule,
    FormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    NgbModalModule,
    NgxLoadingModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    UIModule
  ]
})
export class ModePaiementModule { }

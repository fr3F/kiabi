import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteVipRoutingModule } from './carte-vip-routing.module';
import { ParametrageVipPageComponent } from './pages/parametrage-vip-page/parametrage-vip-page.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormParametrageComponent } from './components/parametrage/form-parametrage/form-parametrage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListCarteVipPageComponent } from './pages/list-carte-vip-page/list-carte-vip-page.component';
import { ListCarteVipComponent } from './components/list-carte-vip/list-carte-vip.component';
import { NgbModalModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClientVipComponentModule } from 'src/app/components/gifi/client-vip/client-vip.module';
import { HistoriquesParametrageComponent } from './components/parametrage/historiques-parametrage/historiques-parametrage.component';
import { PipeModule } from 'src/app/pipe/pipe.module';


@NgModule({
  declarations: [
    ParametrageVipPageComponent,
    FormParametrageComponent,
    ListCarteVipPageComponent,
    ListCarteVipComponent,
    HistoriquesParametrageComponent
  ],
  imports: [
    CommonModule,
    CarteVipRoutingModule,
    UIModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgxPaginationModule,
    ClientVipComponentModule,
    NgbModalModule,
    NgbTooltipModule,
    PipeModule
  ]
})
export class CarteVipModule { }

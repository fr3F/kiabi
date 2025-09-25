import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { MagasinRoutingModule } from './magasin-routing.module';
import { FormHoraireOuvrableComponent } from './components/form/form-horaire-ouvrable/form-horaire-ouvrable.component';
import { FormMagasinComponent } from './components/form/form-magasin/form-magasin.component';
import { FormMonnaieComponent } from './components/form/form-monnaie/form-monnaie.component';
import { InfoMagasinComponent } from './components/info-magasin/info-magasin.component';
import { ListHoraireOuvrableComponent } from './components/list/list-horaire-ouvrable/list-horaire-ouvrable.component';
import { ListMagasinComponent } from './components/list/list-magasin/list-magasin.component';
import { ListMonnaieMagasinComponent } from './components/list/list-monnaie-magasin/list-monnaie-magasin.component';
import { ListParamReglementsComponent } from './components/list/list-param-reglements/list-param-reglements.component';
import { ModifyParamReglementComponent } from './components/modify-param-reglement/modify-param-reglement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { DetailMagasinPageComponent } from './pages/detail-magasin-page/detail-magasin-page.component';
import { FormMagasinPageComponent } from './pages/form-magasin-page/form-magasin-page.component';
import { ListMagasinPageComponent } from './pages/list-magasin-page/list-magasin-page.component';
import { CaisseModule } from '../caisse/caisse.module';


@NgModule({
  declarations: [
    FormHoraireOuvrableComponent,
    FormMagasinComponent,
    FormMonnaieComponent,
    InfoMagasinComponent,
    ListHoraireOuvrableComponent,
    ListMagasinComponent,
    ListMonnaieMagasinComponent,
    ListParamReglementsComponent,
    ModifyParamReglementComponent,
    DetailMagasinPageComponent,
    FormMagasinPageComponent,
    ListMagasinPageComponent
  ],
  imports: [
    CommonModule,
    MagasinRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    UIModule,
    NgxPaginationModule,
    NgxLoadingModule,
    CaisseModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ]
})
export class MagasinModule { }

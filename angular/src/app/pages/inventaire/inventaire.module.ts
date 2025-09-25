import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { WidgetModule } from 'src/app/shared/widget/widget.module';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { InventaireRoutingModule } from './inventaire-routing.module';

import { ListeInventaireComponent } from 'src/app/components/inventaire/liste-inventaire/liste-inventaire.component';
import { ListesInventairesPageComponent } from './listes-inventaires-page/listes-inventaires-page.component';
import { DetailsInventaireComponent } from 'src/app/components/inventaire/details-inventaire/details-inventaire.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SurplusComponent } from 'src/app/components/inventaire/surplus/surplus.component';
import { InventaireProgressComponent } from 'src/app/components/inventaire/inventaire-progress/inventaire-progress.component';

@NgModule({
  declarations: [
    ListeInventaireComponent,
    ListesInventairesPageComponent,
    DetailsInventaireComponent,
    SurplusComponent,
    InventaireProgressComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbPaginationModule,
    NgxPaginationModule,
    InventaireRoutingModule,
    NgxSpinnerModule,
    WidgetModule,
    UIModule,
    NgbTooltipModule,
    NgApexchartsModule,
    ReactiveFormsModule
  ],
  exports: [
      DetailsInventaireComponent,

    ListeInventaireComponent, // permet d’utiliser <app-liste-inventaire> dans d’autres modules si nécessaire
    ListesInventairesPageComponent
  ],
  providers: [DatePipe]
})
export class InventaireModule { }

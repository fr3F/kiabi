import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ClientVipRoutingModule } from './client-vip-routing.module';
import { ListClientVipPageComponent } from './list-client-vip-page/list-client-vip-page.component';
import { AddClientVipPageComponent } from './add-client-vip-page/add-client-vip-page.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ClientVipComponentModule } from 'src/app/components/gifi/client-vip/client-vip.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReportingClientVipPageComponent } from './reporting-client-vip-page/reporting-client-vip-page.component';
import { WidgetModule } from 'src/app/shared/widget/widget.module';


@NgModule({
  declarations: [
    ListClientVipPageComponent,
    AddClientVipPageComponent,
    ReportingClientVipPageComponent
  ],
  imports: [
    CommonModule,
    ClientVipRoutingModule,
    UIModule,
    FormsModule,
    NgbPaginationModule,
    NgxPaginationModule,
    ClientVipComponentModule,
    NgxSpinnerModule,
    WidgetModule
  ],
  providers: [DatePipe]
})
export class ClientVipModule { }

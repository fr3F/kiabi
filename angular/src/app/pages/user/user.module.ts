import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserslistComponent } from './userslist/userslist.component';
import { UseraddComponent } from './useradd/useradd.component';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { UserModuleComponent } from 'src/app/components/user/user.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserUpdatePasswordComponent } from './user-update-password/user-update-password.component';
import { AccesComponent } from './acces/acces.component';


@NgModule({
  declarations: [
    UserslistComponent,
    UseraddComponent,
    UserUpdatePasswordComponent,
    AccesComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    UserModuleComponent,
    UIModule,
    NgxPaginationModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule,

  ]
})
export class UserModule { }

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccesComponent } from "./acces/acces.component";
import { UserUpdatePasswordComponent } from "./user-update-password/user-update-password.component";
import { UseraddComponent } from "./useradd/useradd.component";
import { UserslistComponent } from "./userslist/userslist.component";

const routes: Routes = [
  {
    path: "user-list",
    component: UserslistComponent,
  },
  {
    path: "user-add",
    component: UseraddComponent,
  },
  {
    path: "user-edit/:id",
    component: UseraddComponent,
  },
  {
    path: "profil-edit/:monProfil",
    component: UseraddComponent,
  },
  {
    path: "user-edit-password/:id",
    component: UserUpdatePasswordComponent,
  }, 
  {
    path: "profil-edit-password/:monProfil",
    component: UserUpdatePasswordComponent,
  }, 
  {
    path: "user-access",
    component: AccesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}

import { Component, OnInit } from '@angular/core';
import { BaseComponentComponent } from 'src/app/components/base-component/base-component.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { Acces } from '../../base/base-page/acces.model';

@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.scss']
})
export class UserslistComponent extends BaseComponentComponent implements OnInit {

  title = "Utilisateurs"
  idFonctionnalite: any = 3; 
  
  constructor(
    public userServ: UserService,
    public notif: NotificationService,
    public serv: MenuService 
  ) { 
    super(serv, notif);
  }

  idModule = 3;

  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50, 100];
  users;

  motSearch = "";

  tabFonctionnalite: Acces[] = [
    {idFonctionnalite: 2, nom: "modifier"},
    {idFonctionnalite: 4, nom: "activer"},
    {idFonctionnalite: 6, nom: "modifierMdp"},
    {idFonctionnalite: 7, nom: "reinitialiserMdp"},
  ];
  ngOnInit(): void {
    super.ngOnInit();
    this.fonctionnalites = {}
    this.refreshUsers();
    this.initializeFonctionnalite();
  }

  search(){
    this.page = 1;
    this.refreshUsers();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.refreshUsers();

  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.refreshUsers();
  }

  getParamSearch(){
    let param = {};
    param["search"] = this.motSearch;
    param["page"] = this.page - 1;
    param["size"] = this.pageSize;
    return param; 
  }

  onError = (err) =>{
    this.notif.error(err);
  }

  refreshUsers(){
    const onSucces = (response) => {
      this.users = response.users;
      this.count = response.totalItems; 
    }

    this.userServ.getAll(this.getParamSearch())
      .subscribe(onSucces, this.onError);
  }
}

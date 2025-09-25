import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { BasePageComponent } from '../base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-base-form-page',
  templateUrl: './base-form-page.component.html',
  styleUrls: ['./base-form-page.component.scss']
})
export class BaseFormPageComponent extends BasePageComponent {

  nomTitre = "";
  id;
  detail = false
  data;
  titre = "Ajouter ";
  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public serv: BaseService,
    public menuServ: MenuService

  ) {
    super(menuServ);
  }

  breadcrumb = [
    {label: "Parc", link: ""},
    {label: "Types", link: ""},
    {label: "Ajouter", link: ""}
  ]

  onError = (err) =>{
    this.notif.error(err);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.id = this.id? this.id: this.route.snapshot.paramMap.get("id");
    this.initializeData();
  }

  initializeData(){
    if(this.id || this.detail){
      this.breadcrumb[this.breadcrumb.length -1].label = this.detail?"Détails":"Modifier";
      this.titre = this.detail?"Détails d'":"Modifier ";
      const onSuccess = (response) => {
        this.setData(response)
      }
      this.serv.findById(this.id).subscribe(onSuccess, this.onError);
    }
    this.titre += this.nomTitre;
  }

  setData(response){
    this.data = response;
  }
}

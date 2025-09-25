import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/components/base-form/base-form.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-form-client-vip',
  templateUrl: './form-client-vip.component.html',
  styleUrls: ['./form-client-vip.component.scss']
})
export class FormClientVipComponent extends BaseFormComponent {

  data: any = {
  };

  url:string = "/carte-fidelite";

  magasins;

  nom: string = "Carte de fidélité";

  fileExcel = "";
  constructor(
    public serv: MenuService,
    public notif: NotificationService,
    public baseServ: ClientVipService,
    public formBuilder: FormBuilder,
    public router: Router,
  ) {
    super(serv, notif, baseServ, formBuilder, router);
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.nom": [this.data.nom, [Validators.required]],
      "data.prenom": [this.data.prenom, [Validators.required]],
      "data.dateCreation": [this.data.dateCreation],
      "data.adresse": [this.data.adresse, [Validators.required]],
      // "data.code": [this.data.code],
      "data.ville": [this.data.ville, [Validators.required]],
      "data.telephone": [this.data.telephone, [Validators.required]],
      "data.titre": [this.data.titre, [Validators.required]],
      "data.email": [this.data.email, [Validators.email, Validators.required]],
      // "data.portable": [this.data.portable],
      // "data.adresse2": [this.data.adresse2],
      "data.dateAnniversaire": [this.data.dateAnniversaire],
      "data.optinSmsKiabi": [this.data.optinSmsKiabi],
      "data.optinSmsPartner": [this.data.optinSmsPartner],
      "data.optinEmailKiabi": [this.data.optinEmailKiabi],
      "data.optinEmailPartner": [this.data.optinEwmailPartner],
    })
  }

  valider(){
    this.submit = true;
    this.buildFormUpdate()
    this.showSpinner();
    if(this.formIsInvalid())  return;
    this.baseServ.save(this.data).subscribe(this.onSuccess, this.onError);
  }

  buildFormUpdate(){
    if(this.data.id)
      this.formGroup = this.formBuilder.group({
        "data.optinSmsKiabi": [this.data.optinSmsKiabi],
        "data.optinSmsPartner": [this.data.optinSmsPartner],
        "data.optinEmailKiabi": [this.data.optinEmailKiabi],
        "data.optinEmailPartner": [this.data.optinEmailPartner],
      });
  }


}

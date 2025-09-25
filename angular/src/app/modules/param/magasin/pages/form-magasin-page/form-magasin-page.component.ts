import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { DatePipe } from '@angular/common';
import { MagasinService } from '../../services/magasin.service';
import { BaseFormPageComponent } from 'src/app/pages/base/base-form-page/base-form-page.component';
import { AccesMagasin } from '../../data';

@Component({
  selector: 'app-form-magasin-page',
  templateUrl: './form-magasin-page.component.html',
  styleUrls: ['./form-magasin-page.component.scss']
})
export class FormMagasinPageComponent extends BaseFormPageComponent{

  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public serv: MagasinService,
    public menuServ: MenuService,
    private datePipe: DatePipe
  ) {
    super(route, notif, serv, menuServ)
  }

  nomTitre: string = "un magasin";

  data:any = {
    id: undefined,
    nom: "",
    code: "",
    defaultcompte: "",
    defaultdepot: "",
    identifiant: "",
    facebook: "",
    siteweb: "",
    idDepots: [],
    depots: [],
    monnaies: {monnaie: []},
    horaireouvrable: {horaire: []}
  }

  breadcrumb = [
    {label: "Magasin", link: "/magasin/list"},
    {label: "Ajouter", link: ""}
  ]

  setData(response: any): void {
    this.data = response;
    if(this.data.dateDernierAppro)
      this.data.dateDernierAppro = this.datePipe.transform(this.data.dateDernierAppro, 'yyyy-MM-ddTHH:mm')
    this.data.idDepots = this.data.depots.map((r)=> r.iddepot);
    if(!this.data.monnaies)
      this.data.monnaies = this.data.monnaies = {monnaie: []};
    this.serv.setLogoUrl(this.data);
  }

  idFoncAjout: any = AccesMagasin.create;
  idFoncModifier = AccesMagasin.update;
}

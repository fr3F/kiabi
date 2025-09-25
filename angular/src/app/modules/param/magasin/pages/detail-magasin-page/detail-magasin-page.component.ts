import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponentComponent } from 'src/app/components/base-component/base-component.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MagasinService } from '../../services/magasin.service';
import { AccesMagasin } from '../../data';
import { AccesCaisse } from '../../../caisse/data';

@Component({
  selector: 'app-detail-magasin-page',
  templateUrl: './detail-magasin-page.component.html',
  styleUrls: ['./detail-magasin-page.component.scss']
})
export class DetailMagasinPageComponent extends BaseComponentComponent {

  id;
  data;

  tabFonctionnalite = [
    {idFonctionnalite: AccesMagasin.view, nom: "caisse"},
    {idFonctionnalite: AccesCaisse.create, nom: "ajouterCaisse"},
    {idFonctionnalite: AccesCaisse.update, nom: "modifierCaisse"},
    {idFonctionnalite: AccesMagasin.update, nom: "modifierParam"},
    {idFonctionnalite: AccesMagasin.Charger_encaissement, nom: "chargerEncaissement"},
  ]

  idFonctionnalite = AccesMagasin.view;

  modalRef: NgbModalRef;
  indice = -1;
  selectedCaisse = {};

  resultSynchros: string[];

  constructor(
    private route: ActivatedRoute,
    private magasinService: MagasinService,
    public notif: NotificationService,
    public menuServ: MenuService,
    private modalService: NgbModal,
  ) {
    super(menuServ, notif);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.id = this.route.snapshot.params["id"];
    this.initializeMagasin();
  }

  initializeMagasin(){
    this.magasinService.findById(this.id).subscribe(
      (r)=>{
        this.data = r;
        this.magasinService.setLogoUrl(this.data);
      },
      (err)=> this.notif.error(err)
    )
  }

  showAddCaisse(modal){
    this.indice = -1;
    this.selectedCaisse = {};
    this.modalRef = this.modalService.open(modal)
  }


  modifier(indice, modal){
    this.indice = indice;
    this.selectedCaisse = {...this.data.caisses[indice]};
    this.modalRef = this.modalService.open(modal)

  }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CaisseService } from '../../services/caisse.service';

@Component({
  selector: 'app-list-caisse',
  templateUrl: './list-caisse.component.html',
  styleUrls: ['./list-caisse.component.scss']
})
export class ListCaisseComponent implements OnInit {

  @Input() magasin;

  @Input() list: any[];
  @Input() acces;

  @Output() onModify = new EventEmitter<number>()

  idCaisseSelected;

  constructor(
    public caisseService: CaisseService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
      // Tester la connexion de chaque caisse
        this.list.forEach(caisse => {
    caisse.nomStatus = this.caisseService.getNomStatus(caisse.status);
  });
    this.testConnected()
  }

  testConnected(){
    this.list.forEach(caisse => {
      this.caisseService.testConnected(caisse)
    });
  }

  afficherAction(){
    return this.acces.modifierParam || this.acces.ajouterCaisse || this.acces.modifierCaisse;
  }

  modifier(i: number){
    this.onModify.emit(i);
  }

  exportJson(caisse){
    const onSuccessExportJson = (r)=>{
      const filename = `Caisse-${caisse.nocaisse}-${this.magasin.nom}.json`;
      FileSaver.saveAs(r, filename);
      this.spinner.hide();
    }
    this.caisseService.exporterJson(caisse.id).subscribe(
      onSuccessExportJson,
      this.caisseService.onError
    )
  }

  install(caisse){
    this.spinner.show()
    const onSuccessInstall = (r: any)=>{
      this.caisseService.notif.success("Installé");
      caisse.status = r.status;
      caisse.nomStatus = r.nomStatus;
      caisse.dateInstallation = r.dateInstallation;
      this.spinner.hide();
    }
    this.caisseService.install(caisse.id).subscribe(
      onSuccessInstall,
      this.caisseService.onError
    )
  }


  synchronize(caisse){
    this.spinner.show()
    const onSuccessInstall = (r: any)=>{
      this.caisseService.notif.success("Synchronisé");
      this.spinner.hide();
    }
    this.caisseService.synchronize(caisse.id).subscribe(
      onSuccessInstall,
      this.caisseService.onError
    )
  }


  reinstall(caisse){
    this.spinner.show()
    const onSuccess = (r: any)=>{
      this.caisseService.notif.success("Réinstallé");
      this.spinner.hide();
    }
    this.caisseService.reinstall(caisse.id).subscribe(
      onSuccess,
      this.caisseService.onError
    )
  }

  openModalEncaissement(idCaisse, modal){
    this.idCaisseSelected = idCaisse;
    this.modalService.open(modal, {size: "lg"})
  }
}

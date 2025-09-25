import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-activer-carte',
  templateUrl: './activer-carte.component.html',
  styleUrls: ['./activer-carte.component.scss']
})
export class ActiverCarteComponent implements OnInit {

  @Input() clientVip;
  @Input() acces;
  moisValidation: number;
  modalRef: NgbModalRef;

  constructor(
    private clientService: ClientVipService,
    private modalService: NgbModal,
    private notif: NotificationService
  ) { }

  ngOnInit(): void {
  }

  showButton(){
    return this.acces.activer && !this.clientVip.dateActivation;
  }

  openModal(modal){
    this.modalRef = this.modalService.open(modal, { size: "sm" });  
  }

  activer(){
    if(this.moisValidation <= 0 || !this.moisValidation)
      return this.notif.error("Veuillez renseigner un nombre valide");
    this.clientService.activerCarte(this.clientVip.id, this.moisValidation).subscribe(
      this.onSuccess,
      this.clientService.onError
    )
  }

  onSuccess = (r)=>{
    this.clientVip.dateActivation = r.dateActivation;
    this.modalRef.close();
    this.notif.success("Carte activée");
  }
}

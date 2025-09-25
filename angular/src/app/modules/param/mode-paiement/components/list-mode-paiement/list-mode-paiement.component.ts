import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';
import { ModePaiementService } from '../../services/mode-paiement.service';
const actions = ["modifier", "ajouter", "supprimer", "barcode"]

@Component({
  selector: 'app-list-mode-paiement',
  templateUrl: './list-mode-paiement.component.html',
  styleUrls: ['./list-mode-paiement.component.scss']
})
export class ListModePaiementComponent extends BaseListComponent {
  
  itemSelected: any = {};

  constructor(
    private modalService: NgbModal,
    private modePaiementService: ModePaiementService
  ) { 
    super();
  }

  showAction(){
    for(const action of actions){
      if(this.acces[action])
        return true;
    }
    return false;
  }

  changeItem(){
    this.onChangeItem.emit();
    this.modalService.dismissAll();
  }

  create(modal){
    this.itemSelected = {};
    this.modalService.open(modal)
  }
  
  modify(modal, item){
    this.itemSelected = {...item};
    this.modalService.open(modal)
  }

  delete(index){
    this.modePaiementService.delete(this.list[index].id).subscribe(
      (r)=>{
        this.modePaiementService.notif.info("Supprimé");
        this.list.splice(index, 1);
      },
      this.modePaiementService.onError
    )
  }

  premiereLettreMajuscule(chaine) {
    return chaine.charAt(0).toUpperCase() + chaine.slice(1);
  }
}

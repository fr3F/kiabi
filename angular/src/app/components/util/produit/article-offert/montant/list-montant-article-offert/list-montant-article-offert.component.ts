import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';
import { ProduitService } from 'src/app/services/utils/produit.service';

@Component({
  selector: 'app-list-montant-article-offert',
  templateUrl: './list-montant-article-offert.component.html',
  styleUrls: ['./list-montant-article-offert.component.scss']
})
export class ListMontantArticleOffertComponent  extends BaseListComponent {

  modalRef: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private produitService: ProduitService
  ){
    super();
  }

  showAdd(modal){
    this.modalRef = this.modalService.open(modal, {size: "lg"});
  }

  onAdd(){
    this.modalRef.close();
    this.onChangeItem.emit();
  }

  onCancelAdd(){
    this.modalRef.close();
  }

  
  deleteArticleOffert(i){
    this.produitService.deleteArticleOffert(this.list[i].id).subscribe(
      (r)=>{
        this.produitService.notif.info("Supprimé");
        this.list.splice(i, 1);
      },
      this.produitService.onError
    )
  }

  
  expired(item){
    return new Date() >= new Date(item.fin);
  }
}

import { EncaissementService } from './../../../../services/cloture/encaissement.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-encaissement-validation',
  templateUrl: './list-encaissement-validation.component.html',
  styleUrls: ['./list-encaissement-validation.component.scss']
})
export class ListEncaissementValidationComponent implements OnInit {

  @Input() list;
  @Input() acces;
  
  indiceSelected;
  itemSelected;

  constructor(
    private modalService: NgbModal,
    private encaissementService: EncaissementService
  ) { }

  ngOnInit(): void {
  }

  openModal(i, modal){
    this.itemSelected = this.list[i];
    this.indiceSelected = i;
    this.modalService.open(modal, {size: "lg"});
  }

  validate(){
    this.list.splice(this.indiceSelected, 1)
  }

  delete(i){
    this.encaissementService.delete(this.list[i].idencaissement).subscribe(
      (r)=>{
        this.encaissementService.notif.info("Encaissement supprimé");
        this.list.splice(i, 1);
      },
      this.encaissementService.onError
    )
  }
}

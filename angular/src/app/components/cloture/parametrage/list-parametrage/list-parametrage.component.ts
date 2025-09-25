import { ParametrageClotureService } from './../../../../services/cloture/parametrage-cloture.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';

@Component({
  selector: 'app-list-parametrage',
  templateUrl: './list-parametrage.component.html',
  styleUrls: ['./list-parametrage.component.scss']
})
export class ListParametrageComponent extends BaseListComponent {
  
  barcode: string;
  itemSelected: any = {idMagasins: [], magasins: []};

  constructor(
    private modalService: NgbModal,
    private parametrageClotureService: ParametrageClotureService
  ) { 
    super();
  }

  changeItem(){
    this.onChangeItem.emit();
    this.modalService.dismissAll();
  }

  create(modal){
    this.itemSelected = {idMagasins: [], magasins: []};
    this.modalService.open(modal, {size: "sm"})
  }
  
  modify(modal, item){
    this.itemSelected = item;
    this.modalService.open(modal, {size: "sm"})
  }

  delete(index){
    this.parametrageClotureService.delete(this.list[index].id).subscribe(
      (r)=>{
        this.parametrageClotureService.notif.info("Supprimé");
        this.list.splice(index, 1);
      },
      this.parametrageClotureService.onError
    )
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-param-reglements',
  templateUrl: './list-param-reglements.component.html',
  styleUrls: ['./list-param-reglements.component.scss']
})
export class ListParamReglementsComponent implements OnInit {

  @Input() list;
  @Input() acces;

  itemSelected;
  indiceSelected;
  
  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openModal(i, modal){
    this.itemSelected = {...this.list[i]};
    this.indiceSelected = i;
    this.modalService.open(modal);
  }

  changeItem(){
    this.list[this.indiceSelected] = this.itemSelected;
    this.modalService.dismissAll();
  }
}

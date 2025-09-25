import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';

@Component({
  selector: 'app-list-carte-vip',
  templateUrl: './list-carte-vip.component.html',
  styleUrls: ['./list-carte-vip.component.scss']
})
export class ListCarteVipComponent extends BaseListComponent{
  selectedNumClient;

  constructor(
    private modalService: NgbModal
  ){
    super();
  }

  openHistoriques(modal, client){
    this.selectedNumClient = client.numClient;
    this.modalService.open(modal, {size: "lg"})
  }
}

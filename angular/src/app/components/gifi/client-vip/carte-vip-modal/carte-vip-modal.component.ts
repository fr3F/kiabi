import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-carte-vip-modal',
  templateUrl: './carte-vip-modal.component.html',
  styleUrls: ['./carte-vip-modal.component.scss']
})
export class CarteVipModalComponent implements OnInit {

  @Input() clientVip;
  @Input() acces;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openModal(modal){
    this.modalService.open(modal, {size: "sm"})
  }

  openModalConso(modal){
    this.modalService.open(modal, {size: "lg"})
  }

  openModalRegul(modal){
    this.modalService.open(modal, {size: "lg"})
  }

  canRegularize(){
    return this.acces.regul && this.clientVip.dateActivation;
  }
}

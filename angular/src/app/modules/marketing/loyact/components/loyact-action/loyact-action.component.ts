import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-loyact-action',
  templateUrl: './loyact-action.component.html',
  styleUrls: ['./loyact-action.component.scss']
})
export class LoyactActionComponent implements OnInit {

  @Input() clientVip;
  @Input() acces;
  @Output() refreshClient = new EventEmitter();

  modalRef: NgbModalRef

  constructor(
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  showButton(){
    return true;
    return this.acces.activer;
  }

  openModal(modal){
    this.modalRef = this.modalService.open(modal, { size: "lg" });
  }

  refresh(){
    this.refreshClient.emit();
  }
}

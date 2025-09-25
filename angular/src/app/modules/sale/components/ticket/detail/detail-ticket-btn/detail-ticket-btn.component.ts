import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detail-ticket-btn',
  templateUrl: './detail-ticket-btn.component.html',
  styleUrls: ['./detail-ticket-btn.component.scss']
})
export class DetailTicketBtnComponent implements OnInit {

  @Input() idTicket;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }


  openDetail(modal){
    this.modalService.open(modal, {size: "xl"})
  }

}

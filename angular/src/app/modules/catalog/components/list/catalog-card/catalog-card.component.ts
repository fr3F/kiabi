import { Component, Input, OnInit } from '@angular/core';
import { Catalog } from '../../../models/catalog.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.scss']
})
export class CatalogCardComponent implements OnInit {

  @Input() catalog: Catalog;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  openModal(modal){
    this.modalService.open(modal, { size: "lg"});
  }
}

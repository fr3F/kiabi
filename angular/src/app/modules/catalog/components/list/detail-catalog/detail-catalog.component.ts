import { Component, Input, OnInit } from '@angular/core';
import { Catalog } from '../../../models/catalog.model';

@Component({
  selector: 'app-detail-catalog',
  templateUrl: './detail-catalog.component.html',
  styleUrls: ['./detail-catalog.component.scss']
})
export class DetailCatalogComponent implements OnInit {

  @Input() catalog: Catalog;
  constructor() { }

  ngOnInit(): void {
  }

}

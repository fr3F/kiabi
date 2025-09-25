import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-barcode',
  templateUrl: './list-barcode.component.html',
  styleUrls: ['./list-barcode.component.scss']
})
export class ListBarcodeComponent implements OnInit {

  @Input() list;
  constructor() { }

  ngOnInit(): void {
  }

}

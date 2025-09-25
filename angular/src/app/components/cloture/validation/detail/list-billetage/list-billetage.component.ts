import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-billetage',
  templateUrl: './list-billetage.component.html',
  styleUrls: ['./list-billetage.component.scss']
})
export class ListBilletageComponent implements OnInit {

  @Input() list: any[];

  constructor(
  ) { }

  ngOnInit(): void {
  }

}

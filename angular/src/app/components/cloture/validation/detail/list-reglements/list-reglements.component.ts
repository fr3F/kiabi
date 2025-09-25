import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-reglements',
  templateUrl: './list-reglements.component.html',
  styleUrls: ['./list-reglements.component.scss']
})
export class ListReglementsComponent implements OnInit {


  @Input() encaissement;
  @Input() totalReglement;
  @Input() acces;

  constructor(
  ){
  }

  ngOnInit(): void {
  }

}

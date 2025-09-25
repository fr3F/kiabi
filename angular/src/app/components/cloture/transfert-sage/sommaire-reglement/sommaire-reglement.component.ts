import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sommaire-reglement',
  templateUrl: './sommaire-reglement.component.html',
  styleUrls: ['./sommaire-reglement.component.scss']
})
export class SommaireReglementComponent implements OnInit {

  @Input() data;
  @Input() total;

  constructor(
  ) { }

  ngOnInit(): void {
  }

}

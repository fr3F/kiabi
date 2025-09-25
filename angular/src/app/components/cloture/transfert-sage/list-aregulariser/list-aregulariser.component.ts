import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-aregulariser',
  templateUrl: './list-aregulariser.component.html',
  styleUrls: ['./list-aregulariser.component.scss']
})
export class ListARegulariserComponent implements OnInit {

  @Input() data;

  constructor() { }

  ngOnInit(): void {
  }

}

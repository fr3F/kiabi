import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-monnaie-magasin',
  templateUrl: './list-monnaie-magasin.component.html',
  styleUrls: ['./list-monnaie-magasin.component.scss']
})
export class ListMonnaieMagasinComponent implements OnInit {

  @Input() monnaies;
  @Input() devise;
  constructor() { }

  ngOnInit(): void {
    this.devise = this.devise?? "Ar";
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-magasin',
  templateUrl: './info-magasin.component.html',
  styleUrls: ['./info-magasin.component.scss']
})
export class InfoMagasinComponent implements OnInit {

  @Input() data;
  
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-horaire-ouvrable',
  templateUrl: './list-horaire-ouvrable.component.html',
  styleUrls: ['./list-horaire-ouvrable.component.scss']
})
export class ListHoraireOuvrableComponent implements OnInit {

  @Input() horaireouvrable;
  
  constructor() { }

  ngOnInit(): void {
  }

}

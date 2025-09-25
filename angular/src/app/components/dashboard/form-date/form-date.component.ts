import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-date',
  templateUrl: './form-date.component.html',
  styleUrls: ['./form-date.component.scss']
})
export class FormDateComponent implements OnInit {

  @Output() date = new EventEmitter();

  dateDebut = "";
  dateFin = "";
  constructor() { }

  ngOnInit(): void {
  }

  search(){
    this.date.emit({dateDebut: this.dateDebut, dateFin: this.dateFin});
  }
}

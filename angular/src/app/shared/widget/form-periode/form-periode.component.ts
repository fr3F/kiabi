import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
const PERIODES: {
  labelEcart: string,
  type: string,
  label: string
}[] = [
  {labelEcart: "la dernière année", type: "year", label: "Année"},
  {labelEcart: "le dernier trimestre", type: "quarter", label: "Trimestre"},
  {labelEcart: "le dernier mois", type: "month", label: "Mois"},
  {labelEcart: "la dernière semaine", type: "week", label: "Semaine"},
  {labelEcart: "le dernier jour", type: "date", label: "Jour"},

];
@Component({
  selector: 'app-form-periode',
  templateUrl: './form-periode.component.html',
  styleUrls: ['./form-periode.component.scss']
})
export class FormPeriodeComponent implements OnInit {

  PERIODES = PERIODES;
  PERIODES_REVERSED = [].concat(PERIODES).reverse();
  @Input() type = 'select';
  @Output() onChange = new EventEmitter();

  selectedIndex = 4;

  constructor() { }

  ngOnInit(): void {
    this.change(this.selectedIndex);
  }

  change(i){
    this.selectedIndex = i;
    this.onChange.emit(PERIODES[this.selectedIndex]);
  }
}

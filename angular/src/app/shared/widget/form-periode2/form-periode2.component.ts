import { Component, OnInit } from '@angular/core';
import { FormPeriodeComponent } from '../form-periode/form-periode.component';
const PERIODES: {
  labelEcart: string,
  type: string,
  label: string
}[] = [
  {labelEcart: "la dernière année", type: "year", label: "Année"},
  {labelEcart: "le dernier trimestre", type: "quarter", label: "Trimestre"},
  {labelEcart: "le dernier mois", type: "month", label: "Mois"},
  {labelEcart: "la dernière semaine", type: "week", label: "Semaine"},
  {labelEcart: "le dernier jour", type: "hier", label: "Hier"},
  {labelEcart: "le dernier jour", type: "date", label: "Aujourd'hui"},

];
@Component({
  selector: 'app-form-periode2',
  templateUrl: './../form-periode/form-periode.component.html',
  styleUrls: ['./../form-periode/form-periode.component.scss']
})
export class FormPeriode2Component extends FormPeriodeComponent {

  PERIODES = PERIODES;
  PERIODES_REVERSED = [].concat(PERIODES).reverse();
  selectedIndex = 5;

  
  ngOnInit(): void {
    this.change(this.selectedIndex);
  }

  
  change(i){
    this.selectedIndex = i;
    this.onChange.emit(PERIODES[this.selectedIndex]);
  }
}

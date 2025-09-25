import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-reglement-reporting',
  templateUrl: './list-reglement-reporting.component.html',
  styleUrls: ['./list-reglement-reporting.component.scss']
})
export class ListReglementReportingComponent implements OnInit {

  @Input() data;
  @Input() magasin;
  @Output() exporter = new EventEmitter();
  

  constructor(
  ) { }

  ngOnInit(): void {
  }

  export(){
    this.exporter.emit();
  }

}

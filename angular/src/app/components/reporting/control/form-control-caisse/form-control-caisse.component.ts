import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-control-caisse',
  templateUrl: './form-control-caisse.component.html',
  styleUrls: ['./form-control-caisse.component.scss']
})
export class FormControlCaisseComponent implements OnInit {


  @Output() onChange = new EventEmitter();
  date;

  constructor(
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.change()
  }




  change(refresh = true){
    this.onChange.emit({date: this.date, refresh});
  }
}

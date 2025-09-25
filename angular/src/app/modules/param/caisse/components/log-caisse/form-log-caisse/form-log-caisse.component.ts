import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LogCaisseService } from '../../../services/log-caisse.service';

@Component({
  selector: 'app-form-log-caisse',
  templateUrl: './form-log-caisse.component.html',
  styleUrls: ['./form-log-caisse.component.scss']
})
export class FormLogCaisseComponent implements OnInit {

  @Output() change = new EventEmitter();

  date; 
  message;
  dataGrouped;

  constructor(
    private logCaisseService: LogCaisseService  
  ) { }

  ngOnInit(): void {
  }

  changeDate(){
    this.message = "";
    this.refreshDataGrouped();
  }

  refreshDataGrouped(){
    this.dataGrouped = null;
    if(this.date){
      this.logCaisseService.getGrouped(this.date).subscribe(
        (r)=> {
          this.dataGrouped = r;
          this.emitChange()
        },
        this.logCaisseService.onError
      )
    }
  }

  emitChange(){
    this.change.emit({date: this.date, message: this.message});
  }

  changeMessage(mess){
    this.message = mess;
    this.emitChange();
  }
}

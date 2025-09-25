import { NgxSpinnerService } from 'ngx-spinner';
import { ReportingService } from './../../../../services/reporting/reporting.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-control-caisse',
  templateUrl: './control-caisse.component.html',
  styleUrls: ['./control-caisse.component.scss']
})
export class ControlCaisseComponent implements OnInit {

  @Input() idMagasin;
  @Input() date;

  data;
  constructor(
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(){
    this.spinner.show();
    this.reportingService.getControleCaisses(this.idMagasin, this.date).subscribe(
      (r)=> {
        this.data = r;
        this.spinner.hide();
      },
      this.reportingService.onError
    )
  }
}

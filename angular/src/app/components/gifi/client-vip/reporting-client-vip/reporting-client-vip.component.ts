import { DatePipe } from '@angular/common';
import { ClientVipService } from './../../../../services/gifi/client-vip.service';
import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reporting-client-vip',
  templateUrl: './reporting-client-vip.component.html',
  styleUrls: ['./reporting-client-vip.component.scss']
})
export class ReportingClientVipComponent implements OnInit {

  @Input() debut;
  @Input() fin;
  @Input() list;

  constructor(
    private spinner: NgxSpinnerService,
    private clientVipService: ClientVipService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  getTitle(){
    const resp = "Reporting du " + this.datePipe.transform(this.debut, "dd-MM-yyyy");
    if(this.debut == this.fin)
      return resp;
    return resp + " au " + this.datePipe.transform(this.fin, "dd-MM-yyyy");
  }

  getFilename(){
    const resp = "Reporting-Client-VIP-" + this.datePipe.transform(this.debut, "dd-MM-yyyy");
    if(this.debut == this.fin)
      return resp + ".xlsx";
    return resp + "-au-" + this.datePipe.transform(this.fin, "dd-MM-yyyy") + ".xlsx";
  }


  export(){
    this.spinner.show();
    const onSuccessExport = (r)=>{
      const filename = this.getFilename();
      FileSaver.saveAs(r, filename);
      this.spinner.hide();
    }
    this.spinner.show();
    this.clientVipService.exportReporting(this.debut, this.fin).subscribe(
      onSuccessExport,
      this.clientVipService.onError
    )
  }
}

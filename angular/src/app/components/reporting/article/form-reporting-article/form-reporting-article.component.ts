import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-form-reporting-article',
  templateUrl: './form-reporting-article.component.html',
  styleUrls: ['./form-reporting-article.component.scss']
})
export class FormReportingArticleComponent implements OnInit {

  file;
  filename;
  isBarcode = false;

  canExport = false;

  @Output() onChange = new EventEmitter();

  constructor(
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  setIsBarcode(value: boolean){
    this.isBarcode = value;
    this.canExport = false;
    this.file = null;
    this.filename = "";
  }

  
  importerExcel($event, type = "file"){
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      let file = target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      let me = this;
      reader.onload = function () {
        me[type] = reader.result;
        me.canExport = false;
      };
    }
  }

  canValidate(){
    return this.file != null;
  }

  validate(){
    this.spinner.show();
    this.reportingService.getReportingArticles(this.file, this.isBarcode).subscribe(
      (r)=>{
        this.emit(r);
        this.canExport = true;
        this.spinner.hide();
      },
      this.reportingService.onError
    )
  }

  emit(list){
    this.onChange.emit({
      list,
      isBarcode: this.isBarcode
    })
  }

  

  export(){
    this.spinner.show();
    const onSuccessExport = (r)=>{
      const filename = `Reporting-articles.xlsx`;
      FileSaver.saveAs(r, filename);
      this.spinner.hide();
    }
    this.spinner.show();
    this.reportingService.exportReportingArticles(this.file, this.isBarcode).subscribe(
      onSuccessExport,
      this.reportingService.onError
    )    
  }

  get urlModele(){
    if(this.isBarcode)
      return environment.apiUrl + "/../modeles/reporting-articles/reporting-barcode.xlsx"
    return environment.apiUrl + "/../modeles/reporting-articles/reporting-code.xlsx"
  }
}

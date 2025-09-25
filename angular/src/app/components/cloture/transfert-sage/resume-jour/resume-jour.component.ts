import { EncaissementService } from 'src/app/services/cloture/encaissement.service';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-resume-jour',
  templateUrl: './resume-jour.component.html',
  styleUrls: ['./resume-jour.component.scss']
})
export class ResumeJourComponent implements OnInit {

  @Input() data;
  @Input() showButton = false;
  @Input() date;
  @Input() idParametrage;
  @Input() acces;
  @Output() refresh = new EventEmitter();

  constructor(
    private datePipe: DatePipe,
    private encaissementService: EncaissementService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  exporterSage(){
    this.spinner.show();
    this.encaissementService.exporterSage(this.date, this.idParametrage).subscribe(
      (res)=>{
        let fileName = `Facture-${this.datePipe.transform(this.date, 'yyyy-MM-dd')}-${this.idParametrage}.txt`;
        FileSaver.saveAs(res, fileName)
        this.exporterReglement();
        // this.exporterSql();
      },
      this.encaissementService.onError
    )
  }


  exporterReglement(){
    this.encaissementService.exporterReglement(this.date, this.idParametrage).subscribe(
      (res)=>{
        let fileName = `Reglement-${this.datePipe.transform(this.date, 'yyyy-MM-dd')}-${this.idParametrage}.txt`;
        FileSaver.saveAs(res, fileName);
        this.spinner.hide();
      },
      this.encaissementService.onError
    )
  }

  exporterSql(){
    this.encaissementService.exporterSql(this.date).subscribe(
      (res)=>{
        this.spinner.hide();
        let fileName = `Facture-${this.datePipe.transform(this.date, 'yyyy-MM-dd')}.sql`;
        FileSaver.saveAs(res, fileName)

      },
      this.encaissementService.onError
    )
  }

  sendMailSage(){
    this.spinner.show();
    this.encaissementService.sendMailSage(this.date, this.idParametrage).subscribe(
      (res)=>{
        this.spinner.hide();
        this.encaissementService.notif.success("Mail envoyé");
      },
      this.encaissementService.onError
    )
  }


  initStock(){
    this.refresh.emit();
  }

  // initStock(){
  //   this.spinner.show();
  //   this.encaissementService.initStock().subscribe(
  //     (r)=>{
  //       this.initCump();
  //     },
  //     this.encaissementService.onError
  //   )
  // }

  // initCump(){
  //   this.encaissementService.initCump().subscribe(
  //     (r)=>{
  //       this.encaissementService.notif.success("OK");
  //       this.spinner.hide();
  //       this.refresh.emit();
  //     },
  //     this.encaissementService.onError
  //   )
  // }

}

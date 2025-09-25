import { ParametrageClotureService } from './../../../../services/cloture/parametrage-cloture.service';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-form-transfert-sage',
  templateUrl: './form-transfert-sage.component.html',
  styleUrls: ['./form-transfert-sage.component.scss']
})
export class FormTransfertSageComponent implements OnInit {

  @Output() onChange = new EventEmitter();
  date;
  idParametrage = "";
  parametrages;
  paramSelected;

  constructor(
    private datePipe: DatePipe,
    private parametrageClotureService: ParametrageClotureService
  ) { }

  ngOnInit(): void {
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.initializeParametrages();
  }

  initializeParametrages(){
    this.parametrageClotureService.list({}).subscribe(
      (r)=> {
        this.parametrages = r;
        this.change(false);
      },
      this.parametrageClotureService.onError
    )
  }



  change(refresh = true){
    this.onChange.emit({date: this.date, refresh, idParametrage: this.idParametrage});
    if(this.idParametrage)
      this.paramSelected = this.parametrages.find((r)=> r.id == this.idParametrage)
  }
}

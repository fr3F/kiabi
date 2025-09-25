import { UtilsService } from './../../../../services/utils/utils.service';
import { ReportingService } from 'src/app/services/reporting/reporting.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-consultation-article',
  templateUrl: './form-consultation-article.component.html',
  styleUrls: ['./form-consultation-article.component.scss']
})
export class FormConsultationArticleComponent implements OnInit {

  magasins: any[];

  idMagasin;
  code;
  submit;

  
  @Output() onValidate = new EventEmitter();
  @Output() onValidateStock = new EventEmitter();
  @Output() onValidateStockMagasin = new EventEmitter();
  @Output() onValidateAllStock = new EventEmitter();
  @Output() onChangeCode = new EventEmitter();

  constructor(
    private magasinService: MagasinService,
    private reportingService: ReportingService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
    this.initializeMagasins();
  }

  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      r=> {
        this.magasins = r
        if(this.magasins.length == 1)
          this.idMagasin = this.magasins[0].id;
      },
      this.magasinService.onError
    );
  }

  valider(){
    this.submit = true;
    if(!this.code || !this.idMagasin)
      return;
    this.spinner.show();
    this.consulterStock();
    this.consulterStockMagasin();
    this.getAllStocks();
    this.consulterArticle();
  }

  consulterArticle(){
    this.reportingService.consulterArticle(this.code, this.idMagasin)
    .subscribe(
      (r)=>{
        this.spinner.hide();
        this.onValidate.emit(r);
      },
      this.magasinService.onError        
    )
  }
  
  changeCode(code){
    if(typeof(code) != "string")
      return;
    this.code = code;
    this.onChangeCode.emit(code);
  }

  consulterStock(){
    this.reportingService.consulterStockArticle(this.code, this.idMagasin)
    .subscribe(
      (r)=>{
        this.onValidateStock.emit(r);
      },
      this.magasinService.onError        
    )
  }

  consulterStockMagasin(){
    this.reportingService.consulterStockMagasinArticle(this.code, this.idMagasin)
    .subscribe(
      (r)=>{
        this.onValidateStockMagasin.emit(r);
      },
      this.magasinService.onError        
    )
  }

  getAllStocks(){
    this.utilsService.getStockArticle(this.code).subscribe(
      r=> this.onValidateAllStock.emit(r),
      this.magasinService.onError
    )
  }
}

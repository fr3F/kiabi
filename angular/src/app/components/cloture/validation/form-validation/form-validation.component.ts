import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss']
})
export class FormValidationComponent implements OnInit {

  magasins: any[];

  idMagasin = '';
  date;

  @Output() onChange = new EventEmitter();

  constructor(
    private magasinService: MagasinService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.change();
  }

  initializeMagasins(){
    this.magasinService.findAll().subscribe(
      (r)=> this.magasins = r,
      this.magasinService.onError
    )
  }

  change(){
    this.onChange.emit({date: this.date, idMagasin: this.idMagasin})
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';
@Component({
  selector: 'app-form-consultation-stock',
  templateUrl: './form-consultation-stock.component.html',
  styleUrls: ['./form-consultation-stock.component.scss']
})
export class FormConsultationStockComponent implements OnInit {
  MIN_CODE_LENGTH = 4;

  idMagasin;
  magasins;
  code = "";

  @Output() onChange = new EventEmitter();

  constructor(
    private magasinService: MagasinService
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
  }

  change(){
    const magasin = this.magasins? this.magasins.find((r)=> r.id == this.idMagasin): null;
    const data = {magasin, code: this.code};
    if(this.code && this.code.length < this.MIN_CODE_LENGTH)
      return this.magasinService.notif.error(`Veuillez renseigner un code ayant au moins ${this.MIN_CODE_LENGTH} caractères`)
    this.onChange.emit(data);
  }


  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      (r)=>{
        this.magasins = r;
        if(this.magasins.length == 1){
          this.idMagasin = this.magasins[0].id;
          this.change();
        }
      }
    )
  }

}

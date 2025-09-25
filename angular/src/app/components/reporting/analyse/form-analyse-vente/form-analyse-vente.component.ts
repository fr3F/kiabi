import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-analyse-vente',
  templateUrl: './form-analyse-vente.component.html',
  styleUrls: ['./form-analyse-vente.component.scss']
})
export class FormAnalyseVenteComponent implements OnInit {

  idMagasin;
  magasins;
  type = "date";

  @Output() onChange = new EventEmitter();

  constructor(
    private magasinService: MagasinService
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
  }

  change(){
    const data = {idMagasin: this.idMagasin, type: this.type}
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


  changePeriode(periode){
    this.type = periode.type;
    this.change();
  }
}

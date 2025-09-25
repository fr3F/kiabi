import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataFormSale } from '../../models/dataForm.model';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-sales',
  templateUrl: './form-sales.component.html',
  styleUrls: ['./form-sales.component.scss']
})
export class FormSalesComponent implements OnInit {

  @Output() formChange = new EventEmitter<DataFormSale>();

  magasins: any[];
  data: DataFormSale = {};

  constructor(
    private magasinService: MagasinService
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
  }

  initializeMagasins(){
    this.magasinService.getAllMagasins().subscribe(
      (r)=> this.magasins = r,
      this.magasinService.onError
    )
  }

  validate(){
    try{
      this.verifyValidParams();
      this.formChange.emit(this.data);
    }
    catch(err){
      this.magasinService.notif.error(err.message);
    }
  }

  verifyValidParams(){
    if(!this.data.idMagasin)
      throw new Error("Le magasin est obligatoire");
    if(!this.data.date)
      throw new Error("La date est obligatoire");
  }
}

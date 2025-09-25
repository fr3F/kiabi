import { ParametrageClotureService } from './../../../../services/cloture/parametrage-cloture.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-form-parametrage',
  templateUrl: './form-parametrage.component.html',
  styleUrls: ['./form-parametrage.component.scss']
})
export class FormParametrageComponent implements OnInit {

  submit: boolean = false;
  @Input()  data = {
    designation: "", 
    idMagasins: [], 
    magasins: []
  };

  magasins;
  idMagasin;

  @Output() onValidate = new EventEmitter();
  constructor(
    private parametrageClotureService: ParametrageClotureService, 
  ) { }

  ngOnInit(): void {
    this.initializeMagasins();
  }

  valider(){
    this.submit = true;
    if(!this.data.designation)
      return;
    if(!this.data.idMagasins.length){
      this.parametrageClotureService.notif.error("Veuillez séléctionner au moins un magasin");
      return;
    }
    this.parametrageClotureService.save(this.data).subscribe(
      (r)=>{
        this.parametrageClotureService.notif.success("Enregistré")
        this.onValidate.emit();
      },
      this.parametrageClotureService.onError      
    )
  }

  invalid(){
    return this.submit && !this.data.designation;
  }

  initializeMagasins(){
    this.parametrageClotureService.getMagasinsNonParametre().subscribe(
      (r: any)=>{
        this.magasins = r.concat(this.data.magasins);
      },
      this.parametrageClotureService.onError
    )
  }

  
  addMagasin(): void{
    if(!this.canAddMagasin())
      return;
    this.data.idMagasins.push(this.idMagasin);
    this.data.magasins.push(this.magasins.find((r)=> r.id == this.idMagasin));
  } 
  
  canAddMagasin(): boolean{
    if(!this.idMagasin)
      return false;
    const r = this.data.idMagasins.find((r)=> r == this.idMagasin);
    return r == null;
  }  

  deleteMagasin(i){
    const idMagasin = this.data.magasins[i].id;
    this.data.idMagasins =  this.data.idMagasins.filter((r)=> r != idMagasin);
    this.data.magasins.splice(i, 1); 
  }
}

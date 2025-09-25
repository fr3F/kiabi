import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProduitService } from 'src/app/services/utils/produit.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

var numberRegex = /^\d+$/;
@Component({
  selector: 'app-form-barcode',
  templateUrl: './form-barcode.component.html',
  styleUrls: ['./form-barcode.component.scss']
})
export class FormBarcodeComponent implements OnInit {

  @Input() code;
  @Input() barcode: any = { 
    barcode: "", 
    gamme: "", 
    isConditionne: false,
    conditionnement: 1
  };

  @Output() onValidate = new EventEmitter();
  gammes;
  submit = false;s

  constructor(
    private produitService: ProduitService,
    private utilService: UtilsService
  ) { }

  ngOnInit(): void {
    this.initializeGammes();
    this.setIsConditionne();
  }

  setIsConditionne(){
    this.barcode.isConditionne = this.barcode.conditionnement > 1; 
  }

  get notif(){
    return this.produitService.notif;
  }

  initializeGammes(){
    this.produitService.getGammes(this.code).subscribe(
      r => this.gammes = r,
      this.produitService.onError
    )
  }

  validate(){
    this.submit = true;
    if(this.erreurBarcode() || this.erreurConditionnement())
      return;
    // if(!this.barcode.barcode)
    //   return this.notif.error("Veuillez renseigner le code barre");
    // // if(this.barcode.barcode.length > 13)
    //   return this.notif.error("Veuillez renseigner un code barre avec 13 caractères maximum");
    if(this.gammes.length != 0 && !this.barcode.gamme)
      return this.notif.error("Veuillez séléctionner une gamme");
    if(this.barcode.barcodeid)
      this.update();
    else
      this.create();
  }

  erreurGamme(){
    return this.submit && this.gammes && !this.gammes.length && !this.barcode.gamme;
  }

  erreurBarcode(){
    return this.submit && (!this.barcode.barcode || this.barcode.barcode.length > 13 || !numberRegex.test(this.barcode.barcode));
  }

  erreurConditionnement(){
    return this.submit && this.barcode.isConditionne && 
      (!this.utilService.isNumber(this.barcode.conditionnement || this.barcode.conditionnement <= 1))    
  }

  create(){
    this.produitService.saveBarcode(this.code, this.barcode)
    .subscribe(
      this.onSuccess, 
      this.produitService.onError
    )
  }

  update(){
    this.produitService.updateBarcode(this.barcode.barcodeid, this.barcode)
      .subscribe(
        this.onSuccess, 
        this.produitService.onError
      )
  }

  onSuccess = (r)=>{
    this.onValidate.emit(r);
    this.notif.success("Code barre enregistré")
  }

  changeIsConditionne(){
    this.barcode.conditionnement = 1;
  }

  generateBarcode(){
    this.produitService.generateBarcode().subscribe(
      (r)=>{
        this.barcode.barcode = r.barcode
      },
      this.produitService.onError
    );  
  }

}

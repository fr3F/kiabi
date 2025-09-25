import { ProduitService } from 'src/app/services/utils/produit.service';
import { FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';

@Component({
  selector: 'app-form-article-offert',
  templateUrl: './form-article-offert.component.html',
  styleUrls: ['./form-article-offert.component.scss']
})
export class FormArticleOffertComponent implements OnInit {

  formGroup: FormGroup;
  @Input() code;

  submit: boolean = false;
  gammes: any[];
  magasins: any[];
  data: any = {};

  designationCode;
  urlSearch = "/produits";

  process = false;
  @Output() onValidate = new EventEmitter();
  
  constructor(
    private  formBuilder: FormBuilder,
    private produitService: ProduitService,
    private magasinService: MagasinService,
  ) { }

  ngOnInit(): void {
    this.data = {codePrincipal: this.code, quantiteOffert: 1, gamme: ""};
    this.buildForm();
    this.initializeMagasins();
  }
  
  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.quantiteOffert": [this.data.quantiteOffert, [Validators.required, Validators.min(0)]],
      "data.debut": [this.data.debut, [Validators.required]],
      "data.fin": [this.data.fin, [Validators.required]],
      "data.magasins": [this.data.magasins, [Validators.required]],
      "data.gamme": [this.data.gamme],
    })
  }

  refreshGammes(){
    this.data.gamme = null;
    this.data.agno = null;
    this.produitService.getGammes(this.data.code).subscribe(
      (r)=>{
        this.gammes = r;
        if(this.gammes.length == 1)
          this.data.gamme = this.gammes[0].EG_Enumere;
      }
    )
  }

  initializeMagasins(){
    this.magasinService.findAllRattache().subscribe(
      (r)=>{
        this.magasins = r;
        if(this.magasins.length == 1)
          this.data.magasin = this.magasins[0].nommagasin;
      }
    )
  }

  isInvalidCode(){  
    return this.submit && !this.designationCode;
  }
  isInvalidGamme(){
    return (this.submit && this.gammes && this.gammes.length && !this.data.gamme)
  }

  get form(){
    return this.formGroup.controls;
  }

  isInvalid(att){
    return this.submit && this.form["data." + att].errors;
  }

  
  setCode(event){
    if(event && typeof event == "string"){
      this.designationCode = event;
      this.data.code = this.designationCode.split(" - ")[0];
      this.refreshGammes();
    }
  }

  validate(){
    this.submit = true;
    if(this.process)
      return;
    if(this.formGroup.invalid || this.isInvalidGamme())
      return;
    if(this.isInvalidCode())
      return this.produitService.notif.error("Veuillez séléctionner l'article offert");
    this.process = true;
    this.produitService.spinner.show();
    this.produitService.saveArticleOffert(this.data).subscribe(
      (r)=>{
        this.produitService.notif.success("Enregistré");
        this.onValidate.emit(r);
        this.process = false;
        this.produitService.spinner.hide();
      },
      this.onError
    )
  }

  onError = (err)=>{
    this.produitService.notif.error(err);
    this.process = false;
    this.produitService.spinner.hide();
  }

  setGamme(){
    if(this.data.gamme){
      const gamme = this.gammes.find((r)=> r.EG_Enumere  == this.data.gamme);
      this.data.agno = gamme.AG_No;
    }
  }
}

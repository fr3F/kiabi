import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from 'src/app/services/utils/produit.service';

@Component({
  selector: 'app-add-offered-article',
  templateUrl: './add-offered-article.component.html',
  styleUrls: ['./add-offered-article.component.scss']
})
export class AddOfferedArticleComponent implements OnInit {
  urlSearch = "/produits";
  
  data = {
    quantiteOffert: 1,
    gamme: null,
    code: "",
    agno: null,
    designationCode: null
  }
  
  designationCode = "";
  gammes;

  formGroup: FormGroup;
  submit = false;

  @Output() onValidate = new EventEmitter()
  constructor(
    private formBuilder: FormBuilder,
    private produitService: ProduitService
  ) { }

  ngOnInit(): void {
    this.buildForm(); 
  }

  buildForm(){
    this.formGroup = this.formBuilder.group({
      "data.quantiteOffert": [this.data.quantiteOffert, [Validators.required, Validators.min(0)]],
      "data.gamme": [this.data.gamme],
    })
  }

  
  
  setCode(event){
    if(event && typeof event == "string"){
      this.designationCode = event;
      this.data.code = this.designationCode.split(" - ")[0];
      this.refreshGammes();
    }
  }

  
  isInvalidCode(){  
    return this.submit && !this.designationCode;
  }
  isInvalidGamme(){
    return (this.submit && this.gammes && this.gammes.length && !this.data.gamme)
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

  

  setGamme(){
    if(this.data.gamme){
      const gamme = this.gammes.find((r)=> r.EG_Enumere  == this.data.gamme);
      this.data.agno = gamme.AG_No;
    }
  }

  validate(){
    this.submit = true;
    if(this.isInvalidCode())
      return this.produitService.notif.error("Veuillez séléctionner l'article offert");
    if(this.formGroup.invalid || this.isInvalidCode() || this.isInvalidGamme())
      return;
    else
      this.emit();
  }

  emit(){
    this.data.designationCode = this.designationCode;
    this.onValidate.emit(this.data);
  }  

  get form(){
    return this.formGroup.controls;
  }

  isInvalid(att){
    return this.submit && this.form["data." + att].errors;
  }

}

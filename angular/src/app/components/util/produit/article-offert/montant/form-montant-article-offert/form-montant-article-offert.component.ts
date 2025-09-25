import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MagasinService } from 'src/app/modules/param/magasin/services/magasin.service';
import { ProduitService } from 'src/app/services/utils/produit.service';

@Component({
  selector: 'app-form-montant-article-offert',
  templateUrl: './form-montant-article-offert.component.html',
  styleUrls: ['./form-montant-article-offert.component.scss']
})
export class FormMontantArticleOffertComponent implements OnInit {

  formGroup: FormGroup;

  submit: boolean = false;
  magasins: any[];
  data: any = {
    articles: [],
    typemontant: 1, // Montant
    regle: 1, // 1 Entre, 2 Plus de 
    montantmin: 0
  };


  process = false;
  @Output() onValidate = new EventEmitter();
  
  modalRef: NgbModalRef

  constructor(
    private  formBuilder: FormBuilder,
    private produitService: ProduitService,
    private magasinService: MagasinService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.initializeMagasins();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.debut": [this.data.debut, [Validators.required]],
      "data.fin": [this.data.fin, [Validators.required]],
      "data.magasin": [this.data.magasin, [Validators.required]],
      "data.regle": [this.data.regle, [Validators.required]],
      "data.montantmin": [this.data.montantmin, [Validators.required, Validators.min(0)]],
      "data.montantmax": [this.data.montantmax, [Validators.min(0)]],
    }, { validators: [this.dateValidator, this.montantValidator] });

    this.formGroup.controls['data.regle'].valueChanges.subscribe(value => {
      this.handleRegleChange(value);
    });
  }

  dateValidator(group: FormGroup): ValidationErrors | null {
    const debutControl = group.controls["data.debut"];
    const finControl = group.controls['data.fin'];

    if (!debutControl || !finControl) {
      return null;
    }

    const debut = debutControl.value;
    const fin = finControl.value;

    return debut && fin && debut >= fin ? { dateInvalid: true } : null;
  }

  montantValidator(group: FormGroup): ValidationErrors | null {
    const regleControl = group.controls['data.regle'];
    const montantminControl = group.controls['data.montantmin'];
    const montantmaxControl = group.controls['data.montantmax'];

    if (!regleControl || !montantminControl || !montantmaxControl) {
      return null;
    }

    const regle = regleControl.value;
    const montantmin = montantminControl.value;
    const montantmax = montantmaxControl.value;
    
    if (regle == 1) {
      if (montantmin == null || montantmax == null || montantmin > montantmax) {
        return { montantInvalid: true };
      }
    }
    
    return null;
  }

  handleRegleChange(value: number): void {
    const montantminControl = this.formGroup.controls['data.montantmin'];
    const montantmaxControl = this.formGroup.controls['data.montantmax'];

    if (value == 1) {
      montantminControl.setValidators([Validators.required, Validators.min(0)]);
      montantmaxControl.setValidators([Validators.required, Validators.min(0)]);
    } else {
      montantminControl.setValidators([Validators.required, Validators.min(0)]);
      montantmaxControl.setValidators(null);
      montantmaxControl.setValue(null);
    }
    
    montantminControl.updateValueAndValidity();
    montantmaxControl.updateValueAndValidity();
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


  get form(){
    return this.formGroup.controls;
  }

  isInvalid(att){
    return this.submit && this.form["data." + att].errors;
  }

  finInvalid(){
    return this.formGroup.errors?.dateInvalid && this.submit;
  }

  montantMaxInvalid(){
    return this.formGroup.errors?.montantInvalid && this.submit;
  }

  validate(){
    this.submit = true;
    if(this.formGroup.invalid || this.process)
      return;
    if(!this.data.articles.length)
      return this.produitService.notif.error("Veuillez ajouter au moins un article !");
    if(this.dupliqueExist())
      return this.produitService.notif.error("Veuillez verifier les articles ajoutés !");
    this.process = true;
    this.produitService.spinner.show();
    this.produitService.saveArticleOffertMontant(this.data).subscribe(
      (r)=>{
        this.produitService.notif.success("Enregistré");
        this.onValidate.emit();
        this.process = false;
        this.produitService.spinner.hide();
      },
      this.onError
    )
  }

  dupliqueExist(){
    return this.data.articles.find((r)=> r.duplique);
  }

  onError = (err)=>{
    this.produitService.notif.error(err);
    this.process = false;
    this.produitService.spinner.hide();
  }

  onArticleAdded(newArticle) {
    const existant = this.findArticle(newArticle);
    if(existant)
      return this.produitService.notif.error("Cet article existe déjà dans la liste");
    this.data.articles.push(newArticle);
    
    // this.produitService.verifierDupliqueListArticleOffert( // Verifier si existe dans la base(dupliqué)
    //   [newArticle], 
    //   this.data.magasin,
    //   this.data.debut,
    //   this.data.fin
    // );
    
    this.modalRef.close();
  }

  // Pour chercher si il y a un article existant
  findArticle(newArticle){
    if(newArticle.gamme)
      return this.data.articles.find((r)=> r.code == newArticle.code && r.gamme && this.toUpperCase(r.gamme) == this.toUpperCase(newArticle.gamme));
    return this.data.articles.find((r)=> r.code == newArticle.code && !r.gamme);
  }

  toUpperCase(str: string){
    return str.toString().toUpperCase().trim();
  }

  showAddArticle(modal){
    this.modalRef = this.modalService.open(modal);
  }

  canAdd(){
    return this.data.magasin && this.data.debut && this.data.fin;
  }

  verifyArticles(){
    // if(this.canAdd())
    //   this.produitService.verifierDupliqueListArticleOffert( // Verifier si existe dans la base(dupliqué)
    //     this.data.articles, 
    //     this.data.magasin,
    //     this.data.debut,
    //     this.data.fin
    //   );
  }
}

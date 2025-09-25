import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseFormComponent } from 'src/app/components/base-form/base-form.component';
import { MagasinService } from '../../../services/magasin.service';
const urlValidator = Validators.pattern(/^(http(s)?:\/\/)?(www\.)?[A-Za-z0-9-.]+\.[A-Za-z0-9-]+[/?#]?.*$/);
const facebookValidator = Validators.pattern(/^(http(s)?:\/\/)?(www\.)?facebook+\.[A-Za-z0-9-]+[/?#]?.*$/);
const numberValidator = Validators.pattern(/^-?(0|[1-9]\d*)?$/);
@Component({
  selector: 'app-form-magasin',
  templateUrl: './form-magasin.component.html',
  styleUrls: ['./form-magasin.component.scss']
})
export class FormMagasinComponent  extends BaseFormComponent {

  url = "/magasin/list"
  constructor(
    public serv: MenuService,
    public notif: NotificationService,
    public magasinService: MagasinService,
    public formBuilder: FormBuilder,
    public router: Router,
    private sanitizer: DomSanitizer
  ) {
    super(serv, notif, magasinService, formBuilder, router);
  }

  depots: any[];

  idDepot = "";
  image = ""
  data: any = {
    monnaies: {monnaie: []}
  };


  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.nommagasin": [this.data.nom, [Validators.required, Validators.maxLength(21)]],
      "data.code": [this.data.code, [Validators.required]],
      "data.minicentrale": [this.data.minicentrale],
      "data.nummagasin": [this.data.nummagasin],
      "data.depotstockage": [this.data.depotstockage, [Validators.required]],
      "data.depotlivraison": [this.data.depotlivraison, [Validators.required]],
      "data.souche": [this.data.souche, [Validators.required, numberValidator]],
      "data.lastnumfact": [this.data.lastnumfact, [Validators.required]],
      "data.numdepot": [this.data.numdepot, [numberValidator]],
      "data.lastnumreglement": [this.data.lastnumreglement, [Validators.required]],

      // "data.defaultcompte": [this.data.defaultcompte, [Validators.required]],
      // "data.defaultdepot": [this.data.defaultdepot, [Validators.required]],
      "data.identifiant": [this.data.identifiant, [Validators.required]],
      // "data.facebook": [this.data.facebook, [facebookValidator]],
      "data.telephone": [this.data.telephone],
      "data.facebook": [this.data.facebook, [Validators.required]],
      "data.siteweb": [this.data.siteweb, [urlValidator]],
      // "data.horaireouvrable": [this.data.horaireouvrable, [Validators.required]],
      "data.horaireweek": [this.data.horaireweek, [Validators.required]],
      "data.gifi": this.data.gifi,
      "idDepot": this.idDepot,
      "data.dateDernierAppro": this.data.dateDernierAppro,
      "data.nbChiffreNumFacture": [this.data.nbChiffreNumFacture, [Validators.required, Validators.min(1), Validators.max(11)]],
      "image": this.image,
      "data.devise": [this.data.devise, [Validators.required]],
      "data.storeCode": [this.data.storeCode, [Validators.required, Validators.maxLength(3)]],
      "data.brn": [this.data.brn, [Validators.required]],
      "data.vat": [this.data.vat, [Validators.required]],
      "data.instagram": [this.data.instagram, [Validators.required]],
      "data.nomBase": [this.data.nomBase, [Validators.required]],

    })
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeDepots();
  }


  formIsInvalid(){
    return this.formGroup.invalid;
  }

  valider(){
    this.submit = true;
    if(this.formIsInvalid())
      return;
    this.baseServ.save(this.data).subscribe(
      this.onSuccess,
      this.baseServ.onError
    )
  }

  onSuccess = (data) =>{
    if(this.data.id)
      this.notif.success(this.nom + " modifié" + this.genre + " avec succès")
    else
      this.notif.success(this.nom + " enregistré" + this.genre + " avec succès")
    if(this.redirect)
      this.router.navigateByUrl(this.url );
    this.hideSpinner();
  }

  initializeDepots(){
    this.magasinService.getAllDepots().subscribe(
      r=> this.depots = r,
      this.magasinService.onError
    );
  }

  addDepot(): void{
    if(!this.canAddDepot())
      return;
    this.data.idDepots.push(this.idDepot);
    this.data.depots.push(this.depots.find((r)=> r.iddepot == this.idDepot));
  }

  canAddDepot(): boolean{
    if(!this.idDepot)
      return false;
    const r = this.data.idDepots.find((r)=> r == this.idDepot);
    return r == null;
  }

  deleteDepot(i){
    const idDepot = this.data.depots[i].iddepot;
    this.data.idDepots =  this.data.idDepots.filter((r)=> r != idDepot);
    this.data.depots.splice(i, 1);
  }


  validateFile(file) {
    let fileToUpload = file;
    if (
      fileToUpload.type == "image/jpeg" ||
      fileToUpload.type == "image/png" ||
      fileToUpload.type == "image/jpeg"
    ) {
      //Show image preview
      let me = this;
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.deleteImage()
        this.data.logoUrlLocal = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
        me.data.logoFile = event.target.result;
      };
      reader.readAsDataURL(fileToUpload);
    } else {
      throw new Error("Veuillez uploader une image");
    }
  }

  uploadFile(event) {
    let file = event.target.files[0];
    try {
      if (file)
        this.validateFile(file);
    } catch (err) {
      this.notif.error(err.message);
    }
  }


  deleteImage() {
    this.data.logo = "";
    this.data.logoUrl = "";
    this.data.logoFile = null;
    this.data.logoUrlLocal = null;
  }

}

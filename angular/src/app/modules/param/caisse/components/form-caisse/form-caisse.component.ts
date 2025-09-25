import { NgxSpinnerService } from 'ngx-spinner';
import { Component, Input, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseFormComponent } from 'src/app/components/base-form/base-form.component';
import { CaisseService } from '../../services/caisse.service';
const ipv4Validator = Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/); // Expression régulière pour une adresse IPv4
const portValidator = Validators.pattern(/^(0|([1-9]\d{0,3}))$/);

@Component({
  selector: 'app-form-caisse',
  templateUrl: './form-caisse.component.html',
  styleUrls: ['./form-caisse.component.scss']
})
export class FormCaisseComponent extends BaseFormComponent {

  @Input() magasin;
  @Input() indice;
  @Input() modalRef: NgbModalRef;

  test = false;
  errorTest = false;

  @Input() data: any = {
  };

  constructor(
    public serv: MenuService,
    public notif: NotificationService,
    public baseServ: CaisseService,
    public formBuilder: FormBuilder,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { 
    super(serv, notif, baseServ, formBuilder, router);
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.adresseIp": [this.data.nom, [Validators.required, ipv4Validator]],
      "data.port": [this.data.code, [Validators.required, portValidator]],
      "data.nomBdd": [this.data.defaultcompte, [Validators.required]],
      "data.nocaisse": [this.data.identifiant, [Validators.required]],
      "data.usernameBdd": [this.data.usernameBdd, [Validators.required]],
      "data.passwordBdd": [this.data.passwordBdd, [Validators.required]],
    })
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.spinner.hide();
    this.data.idMagasin = this.magasin.id;
  }

  formIsInvalid(){
    return this.formGroup.invalid;
  }

  valider(){
    this.submit = true;
    // if(!this.test){
    //   this.notif.error("Veuillez d'abord tester");
    //   return;
    // }
    if(this.formIsInvalid())
      return;
    this.baseServ.save(this.data).subscribe(
      this.onSuccess,
      this.baseServ.onError
    )     
  }

  onSuccess: (data: any) => void = (data: any)=> {
    this.modalRef.close();
    this.notif.success("Caisse enregistrée");
    if(this.indice == -1)
      this.magasin.caisses.push(data);
    else
      this.magasin.caisses[this.indice] = data;
  };

  changeTest(){
    this.test = false;
  }

  tester(){
    this.test = false
    this.submit = true;
    this.data.connected = false;
    if(this.formIsInvalid())
      return;
    this.spinner.show();
    this.errorTest = false;
    this.baseServ.testConnexion(this.data).subscribe(
      r=> {
        this.test = true; 
        this.data.connected = true;
        this.spinner.hide();
      },
      (err)=>{
        this.spinner.hide();
        this.notif.error(err)
        this.errorTest = true;
      }
    )
  }

  
  onError = (err) => {
    this.loading = false;
    this.spinner.hide();
    this.notif.error(err)
  }
}

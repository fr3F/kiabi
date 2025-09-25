import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/acces/menu.service';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { BaseComponentComponent } from '../base-component/base-component.component';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.scss']
})
export class BaseFormComponent extends BaseComponentComponent implements OnInit {

  @Input() data;
  @Input() parent;
  genre:string = ""; // "" masculin, "e" feminin
  nom:string = "";
  url:string = "";
  loading: boolean;
  
  constructor(
    public serv: MenuService,
    public notif: NotificationService,
    public baseServ: BaseService,
    public formBuilder: FormBuilder,
    public router: Router
  ) { 
    super(serv, notif);
  }

  buildForm(){
    this.formGroup = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.buildForm()
  }

  submit: boolean = false;
  formGroup: FormGroup
  
  get form(){
    return this.formGroup.controls;
  }
  
  
  // Fonction callback si succes
  onSuccess = (data) =>{
    if(this.data.id)
      this.notif.success(this.nom + " modifié" + this.genre + " avec succès")
    else
      this.notif.success(this.nom + " enregistré" + this.genre + " avec succès")
    if(this.redirect)
      this.router.navigateByUrl(this.url + "/liste");    
    this.hideSpinner();
  }


  valider(){
    this.submit = true;
    this.actionAvantValidation();
    this.showSpinner();
    // console.log(this.data)
    if(this.formIsInvalid())  return;
    this.baseServ.save(this.data).subscribe(this.onSuccess, this.onError);
  }

  showSpinner(){

  }

  hideSpinner(){

  }

  actionAvantValidation(){

  }

  formIsInvalid(): any{
    return this.formGroup.invalid;
  }
  redirect = true

  isInvalid(att){
    return this.submit && this.form["data." + att].errors;
  }

}

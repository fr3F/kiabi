import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @Input() user:any = {
    username: "",
    email: "",
    idRole: "",
    clientId: "",
    nom: "",
    prenom: "",
  } 

  formGroup: FormGroup
  submit = false;
  roles;
  @Input() monProfil = false;

  onError = (err) => {
    this.notif.error(err)
  } 

  constructor(
    private formBuilder: FormBuilder,
    private notif: NotificationService,
    private userServ: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.buildForm();
    this.initializeRoles();
  }

  get form(){
    return this.formGroup.controls;
  }

  buildForm(){
    this.formGroup = this.formBuilder.group({
      // "user.username": [this.user.username, Validators.required],      
      "user.email": [this.user.email, [Validators.required, Validators.email]],      
      "user.idRole": [this.user.idRole, Validators.required],      
      "user.clientId": [this.user.clientId],      
      "user.nom": [this.user.nom, Validators.required],      
      "user.prenom": [this.user.prenom, Validators.required],      
      "user.storeCode": [this.user.storeCode, [Validators.required, Validators.maxLength(3)]],      
    })
  }

  valider(){
    this.submit = true;
    this.save();
  }

  initializeRoles(){
    // this.roles = [];
    const onSuccess = (resp) => { 
      this.roles = resp; };
    this.userServ.getRoles().subscribe(onSuccess, this.onError);
  }

  changeClient(event){
    if(event)
      this.user.clientId = event.id;
    else this.user.clientId = "";
    this.user.client = event;
  }

  formInvalid(){
    // console.log(this.formGroup.invalid)
    return this.formGroup.invalid
    // return this.formGroup.invalid || this.user.clientId == '' || this.user.clientId == null;
  }

  save(){
    if(this.formInvalid()) return;
    if(this.user.idRole != 3) this.user.clientId = "";
    const onSuccess = (resp) => { 
      let mess = "Utilisateur enregistrée avec succès!";
      if(!this.user.id)
        mess +="Vérifier votre email pour le mot de passe";
      this.notif.success(mess);
      if(this.monProfil){
        this.router.navigateByUrl("/profil");
        this.setLocalStorage(this.user);
      }
      else this.router.navigateByUrl("/user/user-list");
    };
    this.userServ.create(this.user).subscribe(onSuccess, this.onError);
  }

  setLocalStorage(user){
    localStorage.setItem("currentUserKiabi", JSON.stringify(user));
  }
}

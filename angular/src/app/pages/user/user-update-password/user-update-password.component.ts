import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { UseraddComponent } from '../useradd/useradd.component';

@Component({
  selector: 'app-user-update-password',
  templateUrl: './user-update-password.component.html',
  styleUrls: ['./user-update-password.component.scss']
})
export class UserUpdatePasswordComponent extends UseraddComponent implements OnInit {
  
  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public userServ: UserService,
    public formBuilder: FormBuilder,
    private router: Router
  ) { 
    super(route, notif, userServ)
  }

  submit = false;

  formGroup: FormGroup
  ngOnInit(): void {
    
    this.id = this.route.snapshot.paramMap.get("id");
    this.monProfil  = this.route.snapshot.paramMap.get("monProfil");
    this.initializeUser();    
    this.buildForm();
  }


  oldPassword = "";
  newPassword = "";
  confirmPassword = "";

  get form(){
    return this.formGroup.controls;
  }

  buildForm(){
    this.formGroup = this.formBuilder.group({
      oldPassword: [this.oldPassword, [Validators.required]],
      newPassword: [this.newPassword, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [this.confirmPassword, [Validators.required, Validators.minLength(8)]]
    });
  }

  validerPassword(){
    this.submit = true;
    if(this.formGroup.invalid) return;
    if(this.confirmPassword != this.newPassword)return;
    // console.log(this.formGroup.invalid)
    const onSuccess = (res) =>{
      this.notif.success("Mot de passe modifié avec succès")
      if(this.monProfil)
      this.router.navigateByUrl("/profil");
      else this.router.navigateByUrl("/user/user-list");
    }
    this.userServ.modifyPassword(this.user.id, this.oldPassword, this.newPassword).subscribe(onSuccess, this.onError);
  }

    
  icon = ["fa-eye", "fa-eye", "fa-eye"];
  typeInput = ["password", "password", "password"];
  show = [false, false]
  
  showPassword(i){
    this.show[i] =! this.show[i]
    this.icon[i] = this.show[i]? "fa-eye-slash": "fa-eye"; 
    this.typeInput[i] = this.show[i]? "text": "password"; 
  }
}

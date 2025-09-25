import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.scss']
})
export class UseraddComponent implements OnInit {

  id;
  titre = "Ajouter un nouveau utilisateur"
  idFonctionnalite: any = 1; 

  user:any = {
    username: "",
    email: "",
    roleId: "",
    clientId: "",
    nom: "",
    prenom: "",
    client: null
  } 

  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public userServ: UserService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
    this.monProfil  = this.route.snapshot.paramMap.get("monProfil");
    this.initializeUser();    
  }

  onError = (err) =>{
    this.notif.error(err);
  }
 
  monProfil = null;
  initializeUser(){
    if(this.id){
    
      this.titre = "Modifier un utilisateur"
      const onSuccess = (response) => {
        // console.log(response)
        this.user = response;
        // this.user.client = response.client;
        
      }
      this.userServ.findById(this.id).subscribe(onSuccess, this.onError);
    }
    else if(this.monProfil){
      this.user = JSON.parse(localStorage.getItem("currentUserKiabi"));
      this.titre = "Modifier mon profil"
    }
  }
}

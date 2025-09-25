import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {

  constructor(
    private notif: NotificationService,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
  }

  get user(){
    return JSON.parse(localStorage.getItem("currentUserKiabi"));
  }

  resetPassword(){
    const onSucces = (response) => {
      this.notif.success("Mot de passe réinitialiser avec succès! Vérifier votre email pour obtenir le nouveau mot de passe.")
    }
    
    const onError = (response) => {
      this.notif.error("Il y a une erreur au serveur")
    }
    this.userServ.resetPassword(this.user.id).subscribe(onSucces, onError);
  }
}

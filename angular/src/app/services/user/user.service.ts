import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NotificationService } from '../notification/notification.service';
const baseUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private notif: NotificationService, 
    private router: Router
  ) { }

  create(user){
    if(user.id) return this.update(user);
    let url = baseUrl + "/users/";
    return this.http.post(url, user);
  }

  update(user){
    let url = baseUrl + "/users/" + user.id;
    return this.http.put(url, user);  
  }

  
  resetPasswordEmail(email){
    let url = baseUrl + "/users/reset/password";
    this.http.put(url, {email}).subscribe(
      (resp)=>{ 
        this.notif.info("Votre mot de passe a été reinitialisé, veuillez vérifier votre email")
        this.router.navigateByUrl("/account/login")
      },
      (err) => {this.notif.error(err)}
    );  
  }
  
  getRoles(){
    let url = baseUrl + "/users/get/roles";
    return this.http.get(url);
  }

  findById(id){
    let url = baseUrl + "/users/show/" + id;
    return this.http.get(url);
  }

  getAll(params){
    let url = baseUrl + "/users/";
    return this.http.get(url, {params});
  }

  modifyPassword(id, oldPassword, newPassword){
    let url = baseUrl + "/users/modifyPassword/" + id;
    return this.http.put(url, {oldPassword, newPassword});
  }

  activate(id){
    let url = baseUrl + "/users/activate/" + id;
    return this.http.put(url, {});
  }

  deactivate(id){
    let url = baseUrl + "/users/deactivate/" + id;
    return this.http.put(url, {});
  }
  
  resetPassword(id){
    let url = baseUrl + "/users/resetPassword/" + id;
    return this.http.put(url, {});
  }
  
}

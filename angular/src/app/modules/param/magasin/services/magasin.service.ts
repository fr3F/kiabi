import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { BaseService } from 'src/app/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class MagasinService extends BaseService{
  nomModele: string = "magasins";
  urlLogo = environment.apiUrl + "/../assets/images/logo-magasins/";

  getAllMagasins(){
    let url = this.apiUrl + "/" + this.nomModele + "/utils/all";
    return this.http.get<any[]>(url)
  }

  updateParamReglement(param){
    let url = this.apiUrl + "/" + this.nomModele + "/parametre-reglements/" + param.id;
    return this.http.patch(url, param);
  }

  findAll(){
    let url = this.apiUrl + "/" + this.nomModele + "/get/all";
    return this.http.get<any[]>(url);
  }

  findMagasinGifi(){
    return this.findAll().pipe(
      map(
      (values: any[])=>{
        return values.filter((r)=> r.gifi);
      })
    )
  }

  findAllRattache(){
    let url = this.apiUrl + "/" + this.nomModele + "/get/all-attached";
    return this.http.get<any[]>(url);
  }
  
  getCaisses(id){
    let url = this.apiUrl + "/" + this.nomModele + "/" + id +"/caisses";
    return this.http.get<any[]>(url);
  }
  
  synchronizeCaisses(id){
    let url = this.apiUrl + "/" + this.nomModele + "/" + id + "/caisses/synchronize"
    return this.http.patch<string[]>(url, {});
  }
  
  updateMailDepot(id, email){
    let url = this.apiUrl + "/" + this.nomModele + "/email-depots/" + id;
    return this.http.patch(url, {email});
  }

  // Recuperer tous les depots
  getAllDepots(){
    let url = this.apiUrl  + this.getNomModele() + "get/depots";
    return this.http.get<any[]>(url)
  }

  setLogoUrl(magasin){
    if(magasin.logo)
    magasin.logoUrl = this.urlLogo + magasin.logo;
  }

  getModepaiements(identifiant){
    let url = this.apiUrl + "/" + this.nomModele + "/" + identifiant +"/mode-paiements";
    return this.http.get<any[]>(url);
  }
    
  getMonnaies(){
    let url = this.apiUrl + "/" + this.nomModele + "/get/monnaies";
    return this.http.get<any[]>(url);
  }

}

import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncaissementService extends BaseService{
  nomModele: string = "encaissements";

  getAValider(date, idMagasin){
    let url = this.apiUrl + "/" + this.nomModele + "/a-valider/magasins/" + idMagasin;
    if(!idMagasin)
      url = this.apiUrl + "/" + this.nomModele + "/a-valider";
    return this.http.get<any[]>(url, {params: {date}});
  }

  
  getDetailValider(id){
    let url = this.apiUrl + "/" + this.nomModele + "/"+ id+ "/a-valider" ;
    return this.http.get(url);
  }

  
  imprimerReglements(id){
    let url = this.apiUrl + "/" + this.nomModele + "/"+ id+ "/imprimer-reglements" ;
    return this.http.get(url, {responseType: 'blob'})
  }

  valider(id, motif, especeRecu){
    let url = this.apiUrl + "/" + this.nomModele + "/"+ id+ "/valider" ;
    return this.http.patch(url, {motif, especeRecu});
  }

  getARegulariser(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele +  "/a-regulariser" ;
    return this.http.get(url, {params: {date, idParametrage}});
  }

  getResumeJour(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele +  "/resume-jour" ;
    return this.http.get(url, {params: {date, idParametrage}});
  }

  getSommaireReglement(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele +  "/sommaire-reglements" ;
    return this.http.get(url, {params: {date, idParametrage}});
  }
  
  getSommaireReglementMagasin(date, idMagasin){
    let url = this.apiUrl + "/" + this.nomModele +  "/sommaire-reglements/magasins/" + idMagasin ;
    return this.http.get(url, {params: {date}});
  }
  
  exporterSage(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele + "/export-sage" ;
    return this.http.get(url, {responseType: 'blob', params: {date, idParametrage}});
  }

  exporterSql(date){
    let url = this.apiUrl + "/" + this.nomModele + "/export-sql" ;
    return this.http.get(url, {responseType: 'blob', params: {date}});
  }

  exporterReglement(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele + "/export-reglement" ;
    return this.http.get(url, {responseType: 'blob', params: {date, idParametrage}});
  }

  
  sendMailSage(date, idParametrage){
    let url = this.apiUrl + "/" + this.nomModele +  "/send-mail-sage" ;
    return this.http.get(url, {params: {date, idParametrage}});
  }

  
  getDetailTicketMagasin(date, magasin, client){
    let url = this.apiUrl + "/" + this.nomModele +  "/detail-ticket-magasin" ;
    return this.http.get(url, {params: {date, magasin, client}});
  }

  
  exporterTicketExcel(date, magasin, client){
    let url = this.apiUrl + "/" + this.nomModele + "/export-ticket-excel" ;
    return this.http.get(url, {responseType: 'blob', params: {date, magasin, client}});
  }

  
  delete(id){
    let url = this.apiUrl + "/" + this.nomModele + "/"+ id ;
    return this.http.delete(url);
  }

  getTotalReglement(reglements){
    let totalReglement = 0;
    for(const item of reglements)
      totalReglement += parseFloat(item.montantreglement);
    return totalReglement;
  }

  initStock(){
    return this.http.get(environment.apiInitStock);
  }

  
  initCump(){
    return this.http.get(environment.apiInitCump);
  }
}

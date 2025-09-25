import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class LogCaisseService  extends BaseService{
  nomModele: string = "log-caisses";

  
  getGrouped(date){
    let url = `${this.apiUrl}${this.getNomModele()}grouped`;
    return this.http.get(url, {params: {date}});
  }
  
  getList(date, message){
    let url = `${this.apiUrl}${this.getNomModele()}`;
    return this.http.get(url, {params: {date, message}});
  }

  getArticlesSuppresionLigne(date, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}articles/suppression-ligne`;
    return this.http.get(url, {params: {date, idMagasin}});
  }

  
  getArticlesAnnulationTicket(date, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}articles/annulation-ticket`;
    return this.http.get(url, {params: {date, idMagasin}});
  }

  exportArticlesSuppresionLigne(date, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}articles/suppression-ligne/excel`;
    return this.http.get(url, {params: {date, idMagasin}, responseType: "blob"});
  }

  
  exportArticlesAnnulationTicket(date, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}articles/annulation-ticket/excel`;
    return this.http.get(url, {params: {date, idMagasin}, responseType: "blob"});
  }
}

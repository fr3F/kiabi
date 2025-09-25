import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ReportingService extends BaseService{

  nomModele: string = "reportings";

  getReportings(params){
    let url = this.apiUrl + "/" + this.nomModele ;
    return this.http.get<any[]>(url, {params});
  }

  exporterExcel(params){
    let url = this.apiUrl + "/" + this.nomModele + "/export" ;
    return this.http.get(url, {responseType: 'blob', params});
  }

  
  getControle(date){
    let url = this.apiUrl + "/" + this.nomModele + "/controle-tickets";
    return this.http.get<any[]>(url, {params: {date}});
  }

  getControleCaisses(idMagasin, date){
    let url = this.apiUrl + "/" + this.nomModele + "/controle-tickets/" + idMagasin + "/caisses";
    return this.http.get<any[]>(url, {params: {date}});
  }

  getVariationVentes(idMagasin, type, params){
    params.type = type;
    let url = this.apiUrl + "/" + this.nomModele + "/variation-vente-magasins/" + idMagasin ;
    return this.http.get<any[]>(url, {params});
  }

  getRecaputilatifTicket(articles){
    const rep = {quantite: 0, montantHT: 0, montantTTC: 0, nbTicket: 0, nbArticle: 0};
    const numTickets = [];
    const refArticles = [];
    for(let article of articles){
      rep.quantite += article.quantite;
      rep.montantHT += article.prixTotalHT;
      rep.montantTTC += article.prixTotalTTC;
      if(refArticles.indexOf(article.code) == -1){
        refArticles.push(article.code);
        rep.nbArticle++;
      }
      if(!numTickets.includes(article.idticket)){
        numTickets.push(article.idticket);
        rep.nbTicket++;
      }
    }
    return rep;
  }

  consulterArticle(code, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-article`;
    return this.http.get(url, {params: {code, idMagasin}});
  }

  listVentes(params){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-article/ventes`;
    return this.http.get(url, {params})
  }

  consulterStockArticle(code, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-stock-article`;
    return this.http.get(url, {params: {code, idMagasin}});
  }

  consulterStockMagasinArticle(code, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-stock-magasin-article`;
    return this.http.get(url, {params: {code, idMagasin}});
  }
  
  consulterStockArticles(code, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-stock-articles`;
    return this.http.get<any[]>(url, {params: {code, idMagasin}});
  }

  
  exporterStockArticles(code, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}consulter-stock-articles/excel`;
    return this.http.get(url, {params: {code, idMagasin}, responseType: 'blob'});
  }

  controlSynchro(idMagasin){
    let url = this.apiUrl + "/" + this.nomModele + "/controle-synchro-magasin/" + idMagasin;
    return this.http.get<{magasin: any, tableSynchros: any[]}>(url);
  }

  controlSynchroCaisse(idCaisse){
    let url = this.apiUrl + "/" + this.nomModele + "/controle-synchro-caisse/" + idCaisse;
    return this.http.get<{magasin: any, tableSynchros: any[]}>(url);
  }
  
  getReglements(idMagasin, debut, fin){
    if(!idMagasin)
      idMagasin = "get/all";
    let url = `${this.apiUrl}${this.getNomModele()}reglement-magasins/${idMagasin}`;
    return this.http.get(url, {params: {debut, fin}});
  }

  exportReglements(idMagasin, debut, fin){
    if(!idMagasin)
      idMagasin = "get/all";
    let url = `${this.apiUrl}${this.getNomModele()}reglement-magasins/${idMagasin}/excel`;
    return this.http.get(url, {params: {debut, fin}, responseType: "blob"});
  }

  getReportingArticles(file, isBarcode){
    let url = `${this.apiUrl}${this.getNomModele()}articles/get`;
    return this.http.post(url, {file, isBarcode});
  }

  exportReportingArticles(file, isBarcode){
    let url = `${this.apiUrl}${this.getNomModele()}articles/export`;
    return this.http.post(url, {file, isBarcode}, {responseType: "blob"});
  }
}

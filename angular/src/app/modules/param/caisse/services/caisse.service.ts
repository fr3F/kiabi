import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';

const CLASS_STATUS = ["badge-soft-warning", "badge-soft-success"]

const NOM_STATUS = {
  1: 'À installer',
  2: 'Installé',
  3: 'Synchronisé',
  4: 'Erreur'
};


@Injectable({
  providedIn: 'root'
})
export class CaisseService extends BaseService{
  nomModele: string = "caisses";

  // getClassStatus(caisse){
  //   return CLASS_STATUS[caisse.status - 1]
  // }
  getNomStatus(status: number): string {
    return NOM_STATUS[status] || 'Inconnu';
  }

  getClassStatus(caisse) {
    if (!caisse || typeof caisse.status !== 'number') return 'badge-secondary';
    return CLASS_STATUS[caisse.status - 1] || 'badge-secondary';
  }


  testConnexion(caisse){
    const body = {host: caisse.adresseIp, port: caisse.port, user: caisse.usernameBdd, password: caisse.passwordBdd}
    let url = this.apiUrl + "/" + this.nomModele + "/test-connexion";
    return this.http.post(url, body);
  }

  testConnected(caisse){
    let url = `${this.apiUrl}${this.getNomModele()}/${caisse.id}/test-connected`;
    this.http.patch(url, {}).subscribe(
      (r: {connected})=>{
        caisse.connected = r.connected;
        caisse.verified = true;
      },
      err=> {
        caisse.verified = true;
        caisse.connected = false;
      }
    );
  }


  exporterJson(id){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/export-json`;
    return this.http.get(url, {responseType: 'blob'});
  }

  getEncaissements(id, date){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/encaissements`;
    return this.http.get(url, {params: {date}});
  }

  install(id){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/install`;
    return this.http.put(url, {});
  }

  synchronize(id){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/synchronize`;
    return this.http.put(url, {});
  }

  reinstall(id){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/re-install`;
    return this.http.put(url, {});
  }

  reinstallTable(id, idTableSynchro){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/re-install-table/${idTableSynchro}`;
    return this.http.put(url, {});
  }

  chargerEncaissement(id, idencaissement){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/charger-encaissement`;
    return this.http.post(url, {idencaissement});
  }

  getArticleTickets(id, debut, fin, client){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/article-tickets`;
    return this.http.get<any[]>(url, {params: {debut, fin, client}});
  }

  getArticleTicketsCode(id, debut, fin, code){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/article-tickets-code/${code}`;
    return this.http.get<any[]>(url, {params: {debut, fin}});
  }

  exportArticleTickets(id, debut, fin, client){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/article-tickets/export`;
    return this.http.get(url, {params: {debut, fin, client}, responseType: 'blob'});
  }

  getTickets(id, debut, fin){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/tickets`;
    return this.http.get<any[]>(url, {params: {debut, fin}});
  }

  findTicketById(id, idTicket){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/tickets/${idTicket}`;
    return this.http.get<any>(url);
  }

  chargerTicketMagasinById(id, idTicket){
    let url = `${this.apiUrl}${this.getNomModele()}/${id}/tickets/${idTicket}/charger-magasin`;
    return this.http.post<any>(url, {});
  }


  regulariserVenteDepot(idticket, codemagasin, nocaisse){
    let url = `${this.apiUrl}/utils/facture-vente-depot/regulariser`;
    return this.http.post<{numeroFacture: string}>(url, {idticket, codemagasin, nocaisse});
  }
}

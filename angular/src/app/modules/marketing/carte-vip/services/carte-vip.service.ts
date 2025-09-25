import { EventEmitter, Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarteVipService extends BaseService{
  nomModele: string = "carte-vip";

  onRefreshHistoryParam = new EventEmitter(); // Pour recharger les receptions de virement 
  

  updateParametrage(parametrage){
    const url = `${environment.apiUrl}${this.getNomModele()}parametrage`
    return this.http.post(url, parametrage);
  }

  
  findParametrage(){
    const url = `${environment.apiUrl}${this.getNomModele()}parametrage`
    return this.http.get(url);
  }
 

  getHistoriquesParam(){
    const url = `${environment.apiUrl}${this.getNomModele()}parametrage/historiques`
    return this.http.get(url);
  }

  getHistoriquesConso(numClient){
    const params = { numClient };
    const url = `${environment.apiUrl}${this.getNomModele()}historiques-conso`
    return this.http.get(url, { params });
  }
 
  getTicketsToRegularize(numClient){
    const params = { numClient };
    const url = `${environment.apiUrl}${this.getNomModele()}regularisations/tickets`
    return this.http.get(url, { params });
  }

  regularizePoint(ticket){
    const body = this.makeBodyForRegul(ticket);
    const url = `${environment.apiUrl}${this.getNomModele()}point/ajouter`
    return this.http.patch<{point: string}>(url, body);
  }

  makeBodyForRegul(ticket){
    return {
      numClient: ticket.clientvip,
      montant: ticket.montanttotal,
      numticket: ticket.numticket,
      hashticket: ticket.hash,
      nocaisse: ticket.nocaisse,
      magasin: ticket.magasin
    }
  }
}

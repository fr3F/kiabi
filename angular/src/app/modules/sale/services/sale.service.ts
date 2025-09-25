import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { Ticket } from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService extends BaseService{
  nomModele: string = "sales";

  getTicketsByMagasin(idMagasin, date){
    let url = this.apiUrl + "/" + this.nomModele + "/magasins/" + idMagasin + "/tickets";
    return this.http.get<Ticket[]>(url, { params: {date}})  
  }
  
  sendTicketsMagasin(idMagasin, date){
    let url = this.apiUrl + "/" + this.nomModele + "/magasins/" + idMagasin + "/tickets/send";
    return this.http.post(url, { date})  
  }

  findTicketById(id){
    const url = `${this.apiUrl}/${this.nomModele}/tickets/${id}`;
    return this.http.get<Ticket>(url)  
  }
}

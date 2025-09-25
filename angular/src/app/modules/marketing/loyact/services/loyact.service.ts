import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { environment } from 'src/environments/environment';
import { LoyactCause } from '../models/loyact-cause.model';

@Injectable({
  providedIn: 'root'
})
export class LoyactService extends BaseService{
  nomModele: string = "loyacts";

  addTicketRecovery(data){
    const url = `${environment.apiUrl}${this.getNomModele()}ticket-recovery`;
    return this.http.post(url, data);
  }

  addAnniversaryPts(data){
    const url = `${environment.apiUrl}${this.getNomModele()}anniversary`;
    return this.http.post(url, data);
  }

  addBirthPoints(data){
    const url = `${environment.apiUrl}${this.getNomModele()}birth-points`;
    return this.http.post(url, data);
  }

  addWelcomePack(data){
    const url = `${environment.apiUrl}${this.getNomModele()}welcome-pack`;
    return this.http.post(url, data);
  }

  addMarketingOperation(data){
    const url = `${environment.apiUrl}${this.getNomModele()}marketing-operation`;
    return this.http.post(url, data);
  }

  addCardTransfert(data){
    const url = `${environment.apiUrl}${this.getNomModele()}card-transfert`;
    return this.http.post(url, data);
  }

  addCardBlocking(data){
    const url = `${environment.apiUrl}${this.getNomModele()}card-blocking`;
    return this.http.post(url, data);
  }

  getTransfertCauses(){
    const url = `${environment.apiUrl}${this.getNomModele()}utils/causes/transferts`;
    return this.http.get<LoyactCause[]>(url);
  }

  getbBlockingCauses(){
    const url = `${environment.apiUrl}${this.getNomModele()}utils/causes/blockings`;
    return this.http.get<LoyactCause[]>(url);
  }
  
}

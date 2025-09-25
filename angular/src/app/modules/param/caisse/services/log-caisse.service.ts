import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';

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
}

import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ClientVipService extends BaseService{
  nomModele: string = "gifi/client-vips";

  exportExcel(){
    let url = `${this.apiUrl}${this.getNomModele()}util/export-excel`;
    return this.http.get(url, {responseType: "blob"});
  }
  
  importExcel(file){
    let url = `${this.apiUrl}${this.getNomModele()}import-excel`;
    return this.http.post(url, {file});
  }

  getReporting(debut, fin){
    const params = {debut, fin};
    let url = `${this.apiUrl}${this.getNomModele()}util/reporting`;
    return this.http.get(url, {params});
  }

  exportReporting(debut, fin){
    const params = {debut, fin};
    let url = `${this.apiUrl}${this.getNomModele()}util/reporting/export-excel`;
    return this.http.get(url, {responseType: "blob", params});
  }

  activerCarte(id, moisValidation: number){
    let url = `${this.apiUrl}${this.getNomModele()}${id}/activer-carte`;
    return this.http.patch(url, { moisValidation });
  }

  sendToKiabi(){
    let url = `${this.apiUrl}${this.getNomModele()}send-kiabi`;
    return this.http.post(url, {});
  }
}

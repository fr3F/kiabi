import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class DataTransfertService extends BaseService{
  nomModele: string = "data-transferts";

  // Recuperer les listes avec paramètre(recherche(search), pagination(page, size))
  listHistoriques(params){
    let url = this.apiUrl + "/" + this.nomModele + "/historiques";
    return this.http.get(url, {params})
  }

  updateData(){
    let url = this.apiUrl + "/" + this.nomModele;
    return this.http.post(url, {});
  }
}

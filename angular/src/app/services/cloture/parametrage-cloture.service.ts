import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ParametrageClotureService extends BaseService{
  nomModele: string = "parametrage-clotures";

  
  getMagasinsNonParametre(){
    let url = `${this.apiUrl}${this.getNomModele()}magasins/non-parametre`;
    return this.http.get(url);
  }
}

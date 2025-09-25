import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { CLSHierrarchy } from '../models/cls-hierrarchy.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService extends BaseService{
  nomModele: string = "catalogs";

  getCLSHierrarchies(){
    let url = this.apiUrl + "/" + this.nomModele + "/cls/hierrarchies";
    return this.http.get<CLSHierrarchy[]>(url)
  }
 
}

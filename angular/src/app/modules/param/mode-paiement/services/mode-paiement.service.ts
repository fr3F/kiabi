import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class ModePaiementService extends BaseService{

  nomModele: string = "parametrage/mode-paiements";
}

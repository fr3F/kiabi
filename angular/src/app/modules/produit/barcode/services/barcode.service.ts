import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base/base.service';
import { BarcodeImport } from '../models/barcodeImport.model';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService extends BaseService{
  nomModele: string = "produits/barcodes";

  
  importExcel(file){
    let url = `${this.apiUrl}${this.getNomModele()}import`;
    return this.http.post<BarcodeImport[]>(url, {file});
  }

  
  print(barcodes: BarcodeImport[]){
    let url = `${this.apiUrl}${this.getNomModele()}print`;
    return this.http.post(url, {barcodes}, { responseType: "blob" });
  }

  printOne(barcode, nombre){
    let url = `${this.apiUrl}${this.getNomModele()}${barcode.barcodeid}/print`;
    const params = { nombre }
    if(barcode.gifi)
      url += '-gifi';
    return this.http.get(url, { params, responseType: "blob" });
  }



}

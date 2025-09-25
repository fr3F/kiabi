import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduitService extends BaseService{
  nomModele: string = "produits";


  findByCode(code){
    let url = `${this.apiUrl}${this.getNomModele()}find/by-code`;
    return this.http.get(url, {params: {code}});
  }

  findByBarcode(barcode, idMagasin){
    let url = `${this.apiUrl}${this.getNomModele()}find/by-barcode`;
    return this.http.get(url, {params: {barcode, idMagasin}});
  }

  getDataProducts(code, endpoint){
    const url = `${this.apiUrl}${this.getNomModele()}${code}/${endpoint}`;
    return this.http.get<any[]>(url);
  }

  getArticleTickets(code){
    return this.getDataProducts(code, 'article-tickets');
  }

  getBarcodes(code){
    return this.getDataProducts(code, 'barcodes');
  }

  getBaremesPourcentages(code){
    return this.getDataProducts(code, 'baremes-pourcentages');
  }

  getGammes(code){
    return this.getDataProducts(code, 'gammes');
  }

  getItemPromotions(code){
    return this.getDataProducts(code, 'item-promotions');
  }

  getRemiseMagasins(code){
    return this.getDataProducts(code, 'remise-magasins');
  }

  getStocks(code){
    return this.getDataProducts(code, 'stocks');
  }

  getStocksLS(code){
    return this.getDataProducts(code, 'stocks-ls');
  }

  getStockMagasins(code){
    return this.getDataProducts(code, 'stock-magasins');
  }

  getTarifMagasins(code){
    return this.getDataProducts(code, 'tarif-magasins');
  }

  getArticleOfferts(code){
    return this.getDataProducts(code, 'article-offerts');
  }

  getHistoriquePrix(code){
    return this.getDataProducts(code, 'historiques-prix');
  }

  getEmplacement(code, gamme, depot){
    const url = `${this.apiUrl}${this.getNomModele()}${code}/emplacement`;
    const params = { gamme, depot };
    return this.http.get<{ emplacement: string }>(url, { params });
  }


  getRefFournisseur(code){
    const url = `${this.apiUrl}${this.getNomModele()}${code}/ref-fournisseur`;
    return this.http.get<{ refFournisseur: string }>(url);
  }


  checkPrixBarcode(barcode, idMagasin){
    const url = environment.apiUrl + "/utils/check-prix-article/par-magasin"
    return this.http.get(url, {params: {barcode, idMagasin}});
  }

  checkPrixCode(code, idMagasin, gamme){
    const url = environment.apiUrl + "/utils/check-prix-article/par-code"
    return this.http.get(url, {params: {code, idMagasin, gamme}});
  }


  checkPrixCodeLS(code){
    const url = environment.apiUrl + "/utils/check-prix-article/par-code/ls"
    return this.http.get(url, {params: {code }});
  }

  saveArticleOffert({codePrincipal, code, gamme, quantiteOffert, debut, fin, magasins, agno}){
    const body = {codePrincipal, code, gamme, quantiteOffert, debut, fin, magasins, agno};
    const url = environment.apiUrl + "/produits/article-offerts";
    return this.http.post(url, body);
  }


  deleteArticleOffert(id){
    const url = environment.apiUrl + "/produits/article-offerts/" + id;
    return this.http.delete(url);
  }


  listWithArticleOfferts(params){
    const url = environment.apiUrl + "/produits/avec-article-offerts";
    return this.http.get(url, {params})
  }


  getArticleOffertsProduitMagasin(code, magasin){
    const url = environment.apiUrl + "/produits/" + code + "/article-offerts-magasins";
    return this.http.get<any[]>(url, {params: {magasin}})
  }


  verifierArticleOffertDuplique(data){
    const url = environment.apiUrl + "/produits/article-offerts/verifier-duplique";
    return this.http.post<{duplique: boolean}>(url, data);
  }

  saveArticleOffertMontant(data){
    const url = environment.apiUrl + "/produits/article-offerts/montant";
    return this.http.post(url, data);
  }


  getArticleOffertsMontant(params){
    const url = environment.apiUrl + "/produits/article-offerts/montant";
    return this.http.get(url, {params})
  }


  verifierDupliqueListArticleOffert(list, magasin, debut, fin){
    for(const item of list){
      const tmp = {...item}
      tmp.magasin = magasin;
      tmp.debut = debut;
      tmp.fin = fin;
      this.verifierArticleOffertDuplique(tmp).subscribe((r)=>{
        item.duplique = r.duplique
      })
    }
  }



  findBarcode(barcode){
    let url = `${this.apiUrl}${this.getNomModele()}barcodes/${barcode}`;
    return this.http.get<{codeproduit: string}>(url);
  }

  saveBarcode(code, barcode){
    let url = `${this.apiUrl}${this.getNomModele()}${code}/barcodes`;
    return this.http.post(url, barcode);
  }

  updateBarcode(idbarcode, barcode){
    let url = `${this.apiUrl}${this.getNomModele()}barcodes/${idbarcode}`;
    return this.http.put(url, barcode);
  }

  deleteBarcode(idbarcode, gifi = false){
    let url = `${this.apiUrl}${this.getNomModele()}barcodes/${idbarcode}`;
    if(gifi)
      url += "/gifi"
    return this.http.delete(url);
  }


  generateBarcode(){
    let url = `${this.apiUrl}${this.getNomModele()}barcodes/generate`;
    return this.http.get<{barcode: string }>(url);
  }
}

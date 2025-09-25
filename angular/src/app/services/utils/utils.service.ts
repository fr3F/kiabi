import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private http: HttpClient
  ) { }

  dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
  }

  
  msToTime(s) {
    if(!s)  return "0"
    // Pad to 2 or 3 digits, default is 2
    function pad(n) {
      return (n + '').padStart(2, "0");
    }
    var j = 0;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;
    if(hrs>=24){
      j = Math.floor(hrs/24)
      hrs = hrs % 24;
    } 
    let rep = pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
    if(j >0)
      rep = j + " jour(s) " + rep;
    return rep;
  }

  getCurrentUser(){
    return JSON.parse(localStorage.getItem("currentUserKiabi"));
  }

  // verifySage(){
  //   return this.http.get(environment.apiSage)
  // }

  getStockArticle(code){
    const url = environment.apiUrl + "/utils/stock-article-depots"
    return this.http.get(url, {params: {code}});
  }

  getErrorInit(){
    const url = environment.apiUrl + "/utils/error-init"
    return this.http.get<{error:boolean}>(url);
  }
  
  // Synchroniser init(comme dans cron à 6h)
  syncInit(){
    const url = environment.apiUrl + "/utils/sync-init"
    return this.http.put(url, {});
  }
  
  isNumber(value: any): boolean {
    if (typeof value === 'string') {
      value = value.replace(/\s+/g, ''); // Supprime tous les espaces
    }
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
}

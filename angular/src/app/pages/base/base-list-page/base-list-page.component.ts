import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseComponentComponent } from 'src/app/components/base-component/base-component.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { BaseService } from 'src/app/services/base/base.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-base-list-page',
  templateUrl: './base-list-page.component.html',
  styleUrls: ['./base-list-page.component.scss']
})
export class BaseListPageComponent extends BaseComponentComponent implements OnInit {
  paramSearchs = [];
  nePasEffacer: string[] = [];
  typeParamSearchs : string[] = [];
  attributeSearchsName : string[] = [];
  title = ""
  @Input() titre;
  @Input() idParent;
  @Input() component = false;
  nomParent;
  constructor(
    public notif: NotificationService,
    public serv: MenuService,
    public baseServ: BaseService
  ) {
    super(serv, notif);
  }

  user
  idModule = 3;

  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [10, 25, 50, 100];
  list;

  motSearch = "";
  loading = false;
  response;
  subscription: Subscription
  plusFiltre:boolean = false;

  ngOnInit(): void {
    super.ngOnInit();
    this.user = this.baseServ.getCurrentUser()
    this.fonctionnalites = {}
    this.refreshData();
    this.initializeFonctionnalite();
  }

  search(){
    this.page = 1;
    this.count = 0;
    this.refreshData();
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.refreshData();

  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.count = 0;
    this.refreshData();
  }

  getParamSearch() : any{
    let param = {};
    param["search"] = this.motSearch;
    param["page"] = this.page<=0? 0: this.page - 1;
    param["size"] = this.pageSize;
    for(let p of this.paramSearchs)
      param[p] = this[p];
    // console.log(param)
    if(this.idParent)
      param[this.nomParent] = this.idParent
    return param;
  }


  onError = (err) =>{
    this.notif.error(err);
  }


  onSucces = (response) => {
    this.loading = false;
    this.response = response;
    this.list = response.data;
    this.count = response.totalItems;
  }

  refreshData(){
    this.loading = true;
    // this.unsubscribe()
    this.subscription = this.baseServ.list(this.getParamSearch())
      .subscribe(this.onSucces, this.onError);
  }

  unsubscribe(){
    if(this.subscription&&!this.subscription.closed)
      this.subscription.unsubscribe()
    // if(this.baseServ.list(this.getParamSearch()).unsubscribe();
  }

  suppression($event){
    this.count --;
  }

  importer(file){

  }

  importExcel($event){
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      let file = target.files[0];
      let reader = new FileReader();
      let me = this;
      reader.readAsDataURL(file);
      reader.onload = function () {
        me.importer(reader.result)
      };
    }
  }


  effacerFiltre(){
    this.motSearch = "";
    for(let p of this.paramSearchs){
      if(this.nePasEffacer.indexOf(p)==-1)
        this[p] = "";
    }
    this.search();
  }

  setFiltreDate(event, nom){
    this[nom + 'Debut'] = event.dateDebut;
    this[nom + 'Fin'] = event.dateFin;
    this.search();
  }


  public updateList(){
    this.list = this.list.filter((r)=> this.filterList(r));
    this.count = this.list.length;
  }

  filterList(item){
    let rep = true;
    for(let i = 0; i < this.typeParamSearchs.length; i++){
      let value = this[this.paramSearchs[i]];
      const itemValue = item[this.attributeSearchsName[i]];
      if(value){
        switch(this.typeParamSearchs[i]){
          case 'date':
            value = new Date(value);
            if(this.paramSearchs[i].endsWith("Fin"))
              rep = rep && new Date(itemValue) >= value;
            else
              rep = rep && new Date(itemValue) <= value;
            break;
          default:
            rep = rep && (itemValue + "").indexOf(value) >= 0;
        }
      }
    }
    return rep;
  }
}

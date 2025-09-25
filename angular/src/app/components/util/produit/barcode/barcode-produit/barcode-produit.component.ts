import { ProduitService } from 'src/app/services/utils/produit.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-barcode-produit',
  templateUrl: './barcode-produit.component.html',
  styleUrls: ['./barcode-produit.component.scss']
})
export class BarcodeProduitComponent implements OnInit {

  @Input() code: string;
  @Input() acces;
  @Input() accesPrint;

  data: any[]; 
  subscription$: Subscription;
  loading = true;
  devise = environment.currency;

  modalRef: NgbModalRef;

  selectedItem;

  searchTxt = "";

  constructor(
    protected produitService: ProduitService,
    protected modalService: NgbModal
  ) { 
  }

  ngOnInit(): void {
    this.refreshData();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.subscription$)
      this.subscription$.unsubscribe();
  }

  refreshData(){
    this.loading = true;
    this.subscription$ = this.produitService.getBarcodes(this.code).subscribe(
      this.onSuccess,
      this.produitService.onError
    )
  }

  onSuccess = (r: any[])=>{
    this.data = r;
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.idMagasin && !changes.idMagasin.firstChange) {
      this.refreshData();
    }
    if (changes.code && !changes.code.firstChange) {
      this.refreshData();
    }
  }

  onCreate($event){
    if($event){
      this.refreshData();
      // const index = this.data.findIndex((r)=> r.barcodeid == $event.barcodeid);
      // if(index == -1)
      //   this.data.push($event);
      // else
      //   this.data[index] = $event;
    }
    this.modalRef.close();
  }

  openCreate(modal){
    this.modalRef = this.modalService.open(modal, {size: "md"});
  }

  openUpdate(modal, item){
    this.selectedItem = {...item};
    this.modalRef = this.modalService.open(modal, {size: "md"});
  }

  delete(item, gifi){
    this.produitService.deleteBarcode(item.barcodeid, gifi).subscribe(
      (r)=>{
        this.produitService.notif.info("Code barre supprimé");
        const index = this.data.findIndex((r)=> r.barcodeid == item.barcodeid);
        this.data.splice(index, 1);
      },
      this.produitService.onError
    )
  }

  get listShowed(){
    if(!this.searchTxt)
      return this.data;
    const search = this.searchTxt.toUpperCase();
    return this.data.filter((r)=>{
      return r.barcode.toUpperCase().includes(search) || (r.gammeObj && r.gammeObj.EG_Enumere.toUpperCase().includes(search));
    })
  }

  showAction(){
    return this.acces || this.accesPrint;
  }

}

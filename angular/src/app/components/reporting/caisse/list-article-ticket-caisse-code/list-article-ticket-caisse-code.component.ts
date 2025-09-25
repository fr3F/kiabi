import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';
import { ProduitService } from 'src/app/services/utils/produit.service';

@Component({
  selector: 'app-list-article-ticket-caisse-code',
  templateUrl: './list-article-ticket-caisse-code.component.html',
  styleUrls: ['./list-article-ticket-caisse-code.component.scss']
})
export class ListArticleTicketCaisseCodeComponent implements OnInit {

  @Input() magasin;
  @Input() code;
  @Input() debut;
  @Input() fin;

  error = "";
  list;
  product;

  unavailableCaisses = [];
  qteVendu = 0;

  constructor(
    private caisseService: CaisseService,
    private produitService: ProduitService
  ) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.magasin || changes.code || changes.fin || changes.debut) {
      this.initializeList();
    }
  }

  initializeList(){
    this.unavailableCaisses = [];
    this.qteVendu = 0;
    this.list = null;
    this.initializeProduct();
    for(const caisse of this.magasin.caisses)
      this.setDataCaisse(caisse);
  }

  setDataCaisse(caisse){
    this.caisseService.getArticleTicketsCode(caisse.id, this.debut, this.fin, this.code).subscribe(
      (r)=>{
        if(!this.list)
          this.list = [];
        this.appendElement(r);
        this.qteVendu = r.map((r)=> r.quantite).reduce((prev, current)=> prev + current, this.qteVendu);
      },
      (err)=>{
        this.unavailableCaisses.push(caisse);
      }
    );
  }

  initializeProduct(){
    this.produitService.findByCode(this.code).subscribe(
      (r)=> this.product = r,
      this.produitService.onError
    )
  }

  appendElement(otherLists: any[]){
    for(const item of otherLists)
      this.list.push(item);
  }
}

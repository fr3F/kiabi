import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

const MOTIF_SHOWED = [
  "Annulation ticket",
  "Suppression ligne",
  "Application remise",
  "Avoir retour",
  "Ouverture tiroir",
  "Retour ticket",
]

@Component({
  selector: 'app-detail-log-caisse',
  templateUrl: './detail-log-caisse.component.html',
  styleUrls: ['./detail-log-caisse.component.scss']
})
export class DetailLogCaisseComponent implements OnInit {

  @Input() data;
  @Input() type;

  afficheArticle
  afficheArticles
  afficherRemise
  afficherMotif

  constructor() { }

  ngOnInit(): void {
    this.afficheArticle = this.data[0].meta.article;
    this.afficheArticles = this.data[0].meta.articles;
    this.afficherRemise = this.type == "Application remise";
    this.setAfficherMotif();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.afficheArticle = this.data[0].meta.article;
    this.afficheArticles = this.data[0].meta.articles;
    this.afficherRemise = this.type == "Application remise";
    this.setAfficherMotif();
  }


  setAfficherMotif(){
    this.afficherMotif = MOTIF_SHOWED.includes(this.type); 
  }

  isEcartCloture(){
    return this.type == "Ecart cloture";
  }
}

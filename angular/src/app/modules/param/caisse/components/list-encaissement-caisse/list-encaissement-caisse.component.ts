import { Component, Input, OnInit } from '@angular/core';
import { CaisseService } from '../../services/caisse.service';

@Component({
  selector: 'app-list-encaissement-caisse',
  templateUrl: './list-encaissement-caisse.component.html',
  styleUrls: ['./list-encaissement-caisse.component.scss']
})
export class ListEncaissementCaisseComponent implements OnInit {

  @Input() acces;
  @Input() idCaisse;

  date;
  list;

  constructor(
    private caisseService: CaisseService
  ) { }

  ngOnInit(): void {
  }

  refreshEncaissement(){
    this.list = null;
    if(this.date){
      this.caisseService.getEncaissements(this.idCaisse, this.date).subscribe(
        (r)=> this.list = r,
        this.caisseService.onError
      )
    }
  }

  // chargerEncaissement(id){
  //   this.caisseService.chargerEncaissement(this.idCaisse, id).subscribe(
  //     (r)=>{
  //       this.caisseService.notif.success("Encaissement chargé");
  //       this.refreshEncaissement();
  //     },
  //     this.caisseService.onError
  //   )
  // }

  chargerEncaissement(idencaissement){
  this.caisseService.chargerEncaissement(this.idCaisse, idencaissement).subscribe(
    (r)=>{
      this.caisseService.notif.success("Encaissement chargé");
      // MAJ locale de l'encaissement concerné pour masquer le bouton
      const encaissement = this.list.find(e => e.idencaissement === idencaissement);
      if (encaissement) {
        encaissement.montantTicketCentral = true; // simule qu'il est maintenant chargé
      }
    },
    this.caisseService.onError
  )
}
}

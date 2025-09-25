import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { EncaissementService } from 'src/app/services/cloture/encaissement.service';

@Component({
  selector: 'app-control-magasin',
  templateUrl: './control-magasin.component.html',
  styleUrls: ['./control-magasin.component.scss']
})
export class ControlMagasinComponent implements OnInit {

  @Input() data;
  @Input() date;
  @Input() acces;
  @Input() magasin = true;
  reglements;
  totalReglement;

  constructor(
    private modalService: NgbModal,
    private encaissementService: EncaissementService
  ) { }

  ngOnInit(): void {
    if(this.magasin)
      this.initializeReglements();
  }

  isDifferent(attribute){
    return Math.round(this.data[attribute]*100) != Math.round(this.data[attribute + "Db"]*100);
  }

  openModal(modal){
    this.modalService.open(modal, {size: "xl"});
  }

  initializeReglements(){
    this.encaissementService.getSommaireReglementMagasin(this.date, this.data.id)
      .subscribe(
        (r)=>{
          this.reglements = r;
          this.totalReglement = this.encaissementService.getTotalReglement(this.reglements);
        },
        this.encaissementService.onError
      )
  }

}

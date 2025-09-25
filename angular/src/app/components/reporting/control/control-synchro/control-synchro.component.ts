import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';

@Component({
  selector: 'app-control-synchro',
  templateUrl: './control-synchro.component.html',
  styleUrls: ['./control-synchro.component.scss']
})
export class ControlSynchroComponent implements OnInit {

  @Input() magasin;
  @Input() acces;
  @Input() tableSynchros: any[];
  @Output() refresh = new EventEmitter();

  constructor(
    private caisseService: CaisseService
  ) { }

  ngOnInit(): void {
  }

  different(data, tableSynchro){
    return data.nombre != tableSynchro.central.nombre;
  }

  reinstallTable(idCaisse, idTableSynchro){
    this.caisseService.spinner.show();
    this.caisseService.reinstallTable(idCaisse, idTableSynchro).subscribe(
      (r)=>{
        this.refresh.emit();
      },
      this.caisseService.onError
    )
  }

  reinstallable(data, tableSynchro){
    return this.acces.reinstallTable && data.dateModification && this.different(data, tableSynchro)
  }
}

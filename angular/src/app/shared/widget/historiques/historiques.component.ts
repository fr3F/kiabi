import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Historique } from 'src/app/model/historique.model';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-historiques',
  templateUrl: './historiques.component.html',
  styleUrls: ['./historiques.component.scss']
})
export class HistoriquesComponent implements OnInit {

  @Input() id: number;
  @Input() endpoint: string;
  // historiques$: Observable<HistoriqueTransfert[]>;
  historiques: Historique[];
  historiques2: Historique[];
  subscription: Subscription;
  all = false;

  constructor(
    private baseService: BaseService,
  ) { }

  ngOnInit(): void {
    this.refreshHistoriques();
    this.baseService.onRefreshHistory.subscribe((r)=>{
      this.refreshHistoriques();
    })
  }

  refreshHistoriques(){
    this.subscription = this.baseService.getHistoriques(this.id, this.endpoint).subscribe(
      r => {
        this.historiques = r;
        this.historiques2 = r.splice(5, this.historiques.length);
      },
      this.baseService.onError
    )
  }


  
  

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { AnniversaryPointsComponent } from '../anniversary-points/anniversary-points.component';

@Component({
  selector: 'app-marketing-operation',
  templateUrl: './marketing-operation.component.html',
  styleUrls: ['./marketing-operation.component.scss']
})
export class MarketingOperationComponent extends AnniversaryPointsComponent{

  validateWithoutTest(){
    this.loyactService.addMarketingOperation(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

}

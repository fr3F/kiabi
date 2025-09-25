import { Component, OnInit } from '@angular/core';
import { AnniversaryPointsComponent } from '../anniversary-points/anniversary-points.component';

@Component({
  selector: 'app-welcome-pack',
  templateUrl: './welcome-pack.component.html',
  styleUrls: ['./welcome-pack.component.scss']
})
export class WelcomePackComponent extends AnniversaryPointsComponent implements OnInit {

  validateWithoutTest(){
    this.loyactService.addWelcomePack(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.formGroup.get('nbPoints')?.setValue(50);
  }

}

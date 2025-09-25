import { Component, OnInit } from '@angular/core';
import { AnniversaryPointsComponent } from '../anniversary-points/anniversary-points.component';

@Component({
  selector: 'app-birth-points',
  templateUrl: './birth-points.component.html',
  styleUrls: ['./birth-points.component.scss']
})
export class BirthPointsComponent extends AnniversaryPointsComponent implements OnInit {

  validateWithoutTest(){
    this.loyactService.addBirthPoints(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.formGroup.get('nbPoints')?.setValue(50);
  }

}

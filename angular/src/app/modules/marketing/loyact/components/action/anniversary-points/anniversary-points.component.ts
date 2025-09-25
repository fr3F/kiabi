import { Component, OnInit } from '@angular/core';
import { TicketRecoveryComponent } from '../ticket-recovery/ticket-recovery.component';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-anniversary-points',
  templateUrl: './anniversary-points.component.html',
  styleUrls: ['./anniversary-points.component.scss']
})
export class AnniversaryPointsComponent extends TicketRecoveryComponent implements OnInit {

  ngOnInit(): void {
    super.ngOnInit();
    this.formGroup.get('nbPoints')?.setValue(50);
  }
  buildForm(){
    this.submit = false;
    this.formGroup = this.formBuilder.group({
      "noCarte": this.clientVip.numClient,
      "nbPoints": [0, [Validators.required, Validators.min(1)]],
    })
  }

  validateWithoutTest(){
    this.loyactService.addAnniversaryPts(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

}

import { Component, OnInit } from '@angular/core';
import { TicketRecoveryComponent } from '../ticket-recovery/ticket-recovery.component';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoyactCause } from '../../../models/loyact-cause.model';

@Component({
  selector: 'app-card-transfert',
  templateUrl: './card-transfert.component.html',
  styleUrls: ['./card-transfert.component.scss']
})
export class CardTransfertComponent  extends TicketRecoveryComponent {

  causes$: Observable<LoyactCause[]>;

  ngOnInit(): void {
    this.buildForm();
    this.causes$ = this.loyactService.getTransfertCauses();
  }

  buildForm(){
    this.submit = false;
    this.formGroup = this.formBuilder.group({
      "noCarte": this.clientVip.numClient,
      "newNoCarte": ["", [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      "cause": [null, [Validators.required]]
    })
  }

  validateWithoutTest(){
    this.loyactService.addCardTransfert(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

  onSuccess = ()=> {
    this.clientVip.numClient = this.formGroup.value.newNoCarte;
    this.buildForm();
    this.loyactService.notif.success("Enregistré");
    this.refreshClient.emit();
  }

}

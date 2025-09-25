import { Component, OnInit } from '@angular/core';
import { TicketRecoveryComponent } from '../ticket-recovery/ticket-recovery.component';
import { LoyactCause } from '../../../models/loyact-cause.model';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-card-blocking',
  templateUrl: './card-blocking.component.html',
  styleUrls: ['./card-blocking.component.scss']
})
export class CardBlockingComponent extends TicketRecoveryComponent {
  
    causes$: Observable<LoyactCause[]>;
  
    ngOnInit(): void {
      this.buildForm();
      this.causes$ = this.loyactService.getbBlockingCauses();
    }
  
    buildForm(){
      this.submit = false;
      this.formGroup = this.formBuilder.group({
        "noCarte": this.clientVip.numClient,
        "cause": [null, [Validators.required]]
      })
    }
    
    validateWithoutTest(){
      this.loyactService.addCardBlocking(this.formGroup.value).subscribe(
        this.onSuccess,
        this.loyactService.onError
      )
    }

}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoyactService } from '../../../services/loyact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-recovery',
  templateUrl: './ticket-recovery.component.html',
  styleUrls: ['./ticket-recovery.component.scss']
})
export class TicketRecoveryComponent implements OnInit {

  @Input() clientVip;
  @Output() refreshClient = new EventEmitter();
  formGroup: FormGroup;
  submit = false;

  constructor(
    protected formBuilder: FormBuilder,
    protected loyactService: LoyactService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.submit = false;
    this.formGroup = this.formBuilder.group({
      "noCarte": this.clientVip.numClient,
      "nbPoints": [0, [Validators.required, Validators.min(1)]],
      "numticket": ["", [Validators.required]]
    })
  }

  validate(){
    this.submit = true;
    if(this.formGroup.invalid)
      return;
    this.validateWithoutTest();
  }

  validateWithoutTest(){
    this.loyactService.addTicketRecovery(this.formGroup.value).subscribe(
      this.onSuccess,
      this.loyactService.onError
    )
  }

  onSuccess = ()=> {
    this.buildForm();
    this.loyactService.notif.success("Enregistré");
    this.refreshClient.emit();
  }

  attributeError(attribute){
    return this.submit && this.formGroup.controls[attribute].errors;
  }
}

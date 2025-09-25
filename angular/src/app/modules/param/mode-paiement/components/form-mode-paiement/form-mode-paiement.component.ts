import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModePaiementService } from '../../services/mode-paiement.service';
const numberValidator = Validators.pattern(/^-?(0|[1-9]\d*)?$/);

@Component({
  selector: 'app-form-mode-paiement',
  templateUrl: './form-mode-paiement.component.html',
  styleUrls: ['./form-mode-paiement.component.scss']
})
export class FormModePaiementComponent implements OnInit {
  
  @Input() data:any = {};
  @Output() onValidate = new EventEmitter();

  formGroup: FormGroup;
  submit: boolean = false;

  types = ["cash", "cheque", "mobile money", "carte", "virement", "acompte", "avoir"]
  
  constructor(
    private formBuilder: FormBuilder,
    private modePaiementService: ModePaiementService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.formGroup = this.formBuilder.group({
      "data.designation": [this.data.designation, [Validators.required]],      
      "data.type": [this.data.type, [Validators.required]],      
      "data.codejournal": [this.data.codejournal, [Validators.required]],      
      "data.noreglement": [this.data.noreglement, [Validators.required, numberValidator]],      
      "data.financingType": [this.data.financingType, [Validators.required, Validators.maxLength(3)]],      
    })
  }

  isInvalid(attribute){
    return this.submit && this.formGroup.controls[attribute].errors;
  }

  valider(){
    this.submit = true;
    if(this.formGroup.invalid)
      return;
    this.modePaiementService.save(this.data).subscribe(
      (r)=>{
        this.modePaiementService.notif.success("Enregistré")
        this.onValidate.emit();
      },
      this.modePaiementService.onError      
    )
  }
  

  premiereLettreMajuscule(chaine) {
    return chaine.charAt(0).toUpperCase() + chaine.slice(1);
  }
}

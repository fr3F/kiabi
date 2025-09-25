import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseFormComponent } from 'src/app/components/base-form/base-form.component';
import { CarteVipService } from '../../../services/carte-vip.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-form-parametrage',
  templateUrl: './form-parametrage.component.html',
  styleUrls: ['./form-parametrage.component.scss']
})
export class FormParametrageComponent extends BaseFormComponent {
  data: any = {};

  constructor(
    public serv: MenuService,
    public notif: NotificationService,
    public baseServ: CarteVipService,
    public formBuilder: FormBuilder,
    public router: Router,
    private spinner: NgxSpinnerService
  ) { 
    super(serv, notif, baseServ, formBuilder, router);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.initializeData();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      "data.equivalenceAjout": [this.data.equivalenceAjout, [Validators.required, Validators.min(0)]],
      "data.equivalenceConso": [this.data.equivalenceConso, [Validators.required, Validators.min(0)]],
      "data.pointMinimum": [this.data.pointMinimum, [Validators.required, Validators.min(0)]],
      "data.type": [this.data.type, [Validators.required, Validators.min(1)]],
      "data.tauxDiscount": [this.data.tauxDiscount, [Validators.required, Validators.min(0)]],
    })
  }

  initializeData(){
    this.baseServ.findParametrage().subscribe(
      (r: { parametrage: any }) => {
        if(r.parametrage)
          this.data = r.parametrage;
      },
      this.baseServ.onError
    )
  }

  valider(){
    this.submit = true;
    if(this.formIsInvalid())
      return;
    this.spinner.show();
    this.baseServ.updateParametrage(this.data).subscribe(
      this.onSuccess,
      this.baseServ.onError
    )     
  }

  onSuccess: (data: any) => void = (data)=>{
    this.notif.success("Paramétrage enregistré");
    this.spinner.hide();
    this.baseServ.onRefreshHistoryParam.emit();
  }; 
 
}

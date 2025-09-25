import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasePageComponent } from 'src/app/pages/base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';

@Component({
  selector: 'app-reporting-client-vip-page',
  templateUrl: './reporting-client-vip-page.component.html',
  styleUrls: ['./reporting-client-vip-page.component.scss']
})
export class ReportingClientVipPageComponent extends BasePageComponent {

  idFonctionnalite: any = 131;
  debut;
  fin;

  data;

  constructor(
    public menuService: MenuService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private clientVipService: ClientVipService
  ){
    super(menuService)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.debut = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.fin = this.debut;
    this.search();
  }

  changeDate({dateDebut, dateFin}){
    this.debut = dateDebut;
    this.fin = dateFin;
    this.search();
  }

  search(){
    if(!this.debut || !this.fin)
      return this.data = null;
    this.spinner.show();
    this.clientVipService.getReporting(this.debut, this.fin).subscribe(
      (r)=>{
        this.data = r;
        this.spinner.hide();
      },
      this.clientVipService.onError
    )
  }
}

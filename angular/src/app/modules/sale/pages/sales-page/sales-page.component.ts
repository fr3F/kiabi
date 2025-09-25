import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from 'src/app/pages/base/base-page/base-page.component';
import { AccesSale } from '../../data';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SaleService } from '../../services/sale.service';
import { Ticket } from '../../models/ticket.model';
import { DataFormSale } from '../../models/dataForm.model';
import { Acces } from 'src/app/pages/base/base-page/acces.model';

@Component({
  selector: 'app-sales-page',
  templateUrl: './sales-page.component.html',
  styleUrls: ['./sales-page.component.scss'],
})
export class SalesPageComponent extends BasePageComponent {

  idFonctionnalite: any = AccesSale.view;
  tickets: Ticket[];
  dataForm: DataFormSale;

  tabFonctionnalite: Acces[] = [
    { nom: "send", idFonctionnalite: AccesSale.send}
  ];

  constructor(
    public menuServ: MenuService,
    private spinner: NgxSpinnerService,
    private saleService: SaleService
  ) {
    super(menuServ)
  }
  
  formChange(data: DataFormSale){
    this.dataForm = data;
    this.spinner.show();
    this.saleService.getTicketsByMagasin(data.idMagasin, data.date).subscribe(
      this.onSuccess,
      this.saleService.onError
    )
  }

  onSuccess = (r: Ticket[])=>{
    this.tickets = r;
    this.spinner.hide();
  }
}

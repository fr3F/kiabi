import { Component, Input, OnInit } from '@angular/core';
import { DataFormSale } from '../../../models/dataForm.model';
import { SaleService } from '../../../services/sale.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-send-sales',
  templateUrl: './send-sales.component.html',
  styleUrls: ['./send-sales.component.scss']
})
export class SendSalesComponent implements OnInit {

  @Input() nbTicket: number;
  @Input() dataForm: DataFormSale;
  @Input() acces;

  constructor(
    private saleService: SaleService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  showButton(){
    return this.acces.send && this.nbTicket > 0;
  }

  send(){
    this.spinner.show();
    this.saleService.sendTicketsMagasin(this.dataForm.idMagasin, this.dataForm.date).subscribe(
      this.onSuccess,
      this.saleService.onError
    );
  }

  onSuccess = (r)=>{  
    this.spinner.hide();
    this.saleService.notif.success("Envoyé");
  }
}

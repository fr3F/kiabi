import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from '../../base/base-page/base-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncaissementService } from 'src/app/services/cloture/encaissement.service';
import { ActivatedRoute } from '@angular/router';
import { Acces } from '../../base/base-page/acces.model';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detail-ticket-magasin-page',
  templateUrl: './detail-ticket-magasin-page.component.html',
  styleUrls: ['./detail-ticket-magasin-page.component.scss']
})
export class DetailTicketMagasinPageComponent extends BasePageComponent{


  date;
  magasin;
  client;
  idFonctionnalite: any = 37;

  itemTickets;

  tabFonctionnalite: Acces[] = [
    {idFonctionnalite: 38, nom: "exporter"}
  ];
  constructor(
    public menuServ: MenuService,
    private encaissementService: EncaissementService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    super(menuServ)
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.date = this.route.snapshot.params["date"];
    this.magasin = this.route.snapshot.params["magasin"];
    this.client = this.route.snapshot.params["client"];
    this.initializeItemTickets();
  }

  initializeItemTickets(){
    this.spinner.show();
    this.encaissementService.getDetailTicketMagasin(this.date, this.magasin, this.client).subscribe(
      (r)=> {
        this.spinner.hide();
        this.itemTickets = r;
      },
      this.encaissementService.onError
    )
  }


  exporterExcel(){
    this.spinner.show();
    this.encaissementService.exporterTicketExcel(this.date, this.magasin, this.client).subscribe(
      (res)=>{
        this.spinner.hide();
        let fileName = `Ticket-${this.magasin}-${this.client}-${this.datePipe.transform(this.date, 'dd-MM-yyyy')}.xlsx`;
        FileSaver.saveAs(res, fileName)
      },
      this.encaissementService.onError
    )
  }

}

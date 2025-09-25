import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import * as FileSaver from 'file-saver';
import { CaisseService } from 'src/app/modules/param/caisse/services/caisse.service';

@Component({
  selector: 'app-list-article-ticket-caisse',
  templateUrl: './list-ticket-caisse.component.html',
  styleUrls: ['./list-ticket-caisse.component.scss']
})
export class ListArticleTicketCaisseComponent implements OnInit, OnChanges {

  @Input() listInitial: any[] = [];
  @Input() debut;
  @Input() fin;
  @Input() caisse;
  @Input() magasin;
  @Input() client;

  list: any[] = [];
  motSearch = "";

  constructor(
    protected caisseService: CaisseService,
    protected spinner: NgxSpinnerService,
    protected datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.list = [...this.listInitial]; // copie initiale
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listInitial'] && changes['listInitial'].currentValue) {
      this.list = [...this.listInitial];
      this.search(); // re-filtrer si nouvelle liste
    }
  }

  search(): void {
    const term = this.motSearch?.toLowerCase().trim();
    if (term) {
      this.list = this.listInitial.filter(r =>
        (r.code?.toLowerCase().includes(term)) ||
        (r.designation?.toLowerCase().includes(term))
      );
    } else {
      this.list = [...this.listInitial];
    }
  }

  exporter(): void {
    this.spinner.show();
    this.caisseService.exportArticleTickets(this.caisse.id, this.debut, this.fin, this.client).subscribe(
      (res) => {
        this.spinner.hide();
        FileSaver.saveAs(res, this.getFilename());
      },
      this.caisse.onError
    );
  }

  getFilename(): string {
    let fileName = `Reporting-${this.magasin}-Caisse-N°${this.caisse.nocaisse}-${this.datePipe.transform(this.debut, 'dd-MM-yyyy')}`;
    if (this.debut !== this.fin) {
      fileName += `-${this.datePipe.transform(this.fin, 'dd-MM-yyyy')}`;
    }
    if (this.client) {
      fileName += `-${this.client}`;
    }
    return fileName + ".xlsx";
  }
}

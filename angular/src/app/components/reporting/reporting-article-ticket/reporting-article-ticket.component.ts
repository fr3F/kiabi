import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-reporting-article-ticket',
  templateUrl: './reporting-article-ticket.component.html',
  styleUrls: ['./reporting-article-ticket.component.scss']
})
export class ReportingArticleTicketComponent implements OnInit {

  @Input() data;
  @Input() recap;
  @Input() acces;
  @Output() exporter = new EventEmitter();
  

  constructor(
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
  }

  export(){
    this.exporter.emit();
  }
}

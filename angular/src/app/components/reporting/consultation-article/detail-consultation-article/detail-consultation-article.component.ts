import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-detail-consultation-article',
  templateUrl: './detail-consultation-article.component.html',
  styleUrls: ['./detail-consultation-article.component.scss']
})
export class DetailConsultationArticleComponent implements OnInit {

  @Input() data;
  @Input() showDesignation = true;


  constructor(
  ) { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-list-reglement',
  templateUrl: './list-reglement.component.html',
  styleUrls: ['./list-reglement.component.scss']
})
export class ListReglementComponent implements OnInit {

  @Input() reglements;
  @Input() total;
  

  constructor(
  ) { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base/base.service';

@Component({
  selector: 'app-info-produit',
  templateUrl: './info-produit.component.html',
  styleUrls: ['./info-produit.component.scss']
})
export class InfoProduitComponent implements OnInit {
  @Input() produit;
  @Input() acces;

  constructor(
  ) { 
  }

  ngOnInit(): void {
  }
}

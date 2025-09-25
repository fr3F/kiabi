import { Component, OnInit } from '@angular/core';
import { BasePageComponent } from 'src/app/pages/base/base-page/base-page.component';
import { AccesCarteVip } from '../../data';

@Component({
  selector: 'app-parametrage-vip-page',
  templateUrl: './parametrage-vip-page.component.html',
  styleUrls: ['./parametrage-vip-page.component.scss']
})
export class ParametrageVipPageComponent extends BasePageComponent {
  idFonctionnalite: any = AccesCarteVip.manage;
}

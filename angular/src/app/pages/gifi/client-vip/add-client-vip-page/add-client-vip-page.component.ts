import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseFormPageComponent } from 'src/app/pages/base/base-form-page/base-form-page.component';
import { MenuService } from 'src/app/services/acces/menu.service';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-add-client-vip-page',
  templateUrl: './add-client-vip-page.component.html',
  styleUrls: ['./add-client-vip-page.component.scss']
})
export class AddClientVipPageComponent  extends BaseFormPageComponent{

  constructor(
    public route: ActivatedRoute,
    public notif: NotificationService,
    public serv: ClientVipService,
    public menuServ: MenuService,
  ) { 
    super(route, notif, serv, menuServ)
  }
 
  nomTitre: string = "une carte de fidelité";
  
  data:any = {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';

@Component({
  selector: 'app-send-client-kiabi',
  templateUrl: './send-client-kiabi.component.html',
  styleUrls: ['./send-client-kiabi.component.scss']
})
export class SendClientKiabiComponent implements OnInit {

  @Input() acces;

  constructor(
    private clientService: ClientVipService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
  }

  showButton(){
    return this.acces.send;
  }

  send(){
    this.spinner.show();
    this.clientService.sendToKiabi().subscribe(
      this.onSuccess,
      this.clientService.onError
    );
  }

  onSuccess = (r)=>{  
    this.spinner.hide();
    this.clientService.notif.success("Envoyé");
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  isVisible: string;

  transactions: Array<[]>;
  statData: Array<[]>;

  isActive: string;

  @ViewChild('content') content;
  constructor(
    public notif: NotificationService,

  ) {
  }

  ngOnInit() {

    /**
     * horizontal-vertical layput set
     */
     const attribute = document.body.getAttribute('data-layout');

     this.isVisible = attribute;
     const vertical = document.getElementById('layout-vertical');
     if (vertical != null) {
       vertical.setAttribute('checked', 'true');
     }
     if (attribute == 'horizontal') {
       const horizontal = document.getElementById('layout-horizontal');
       if (horizontal != null) {
         horizontal.setAttribute('checked', 'true');
        //  console.log(horizontal);
       }
     }

    //  this.initializeData();
  }

  dateDebut = ""
  dateFin = ""

  changeDate(event){
    this.dateDebut = event.dateDebut;
    this.dateFin = event.dateFin;
    this.initializeData();
  }

  data;
  
  onError = (err) => {
    this.notif.error(err);
  }

  async initializeData(){
    const onSucces = (resp) =>{
      this.data = resp; 
      // console.log(this.data)
    }
    let params = {dateDebut:this.dateDebut, dateFin: this.dateFin}
    // this.dash.getDashboard(params).subscribe(onSucces, this.onError);
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.openModal();
    // }, 2000);
  }

  /**
   * Fetches the data
   */
}

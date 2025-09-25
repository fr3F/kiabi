import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-search-date',
  templateUrl: './search-date.component.html',
  styleUrls: ['./search-date.component.scss']
})
export class SearchDateComponent implements OnInit {

  @Input() dateDebut = "";
  @Input() dateFin = "";

  @Input() titre = "Date";
  @Output() onChange = new EventEmitter();

  constructor(
    private notifService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  search(){
    if(this.dateDebut && this.dateFin && new Date(this.dateDebut) > new Date(this.dateFin)){
      this.dateFin = "";
      this.notifService.error("La date de début doit être avant la date fin");
      return;
    }
    this.onChange.emit({dateDebut: this.dateDebut, dateFin: this.dateFin});
  }
}

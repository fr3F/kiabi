import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTransfertService } from '../../../services/data-transfert.service';

@Component({
  selector: 'app-update-data',
  templateUrl: './update-data.component.html',
  styleUrls: ['./update-data.component.scss']
})
export class UpdateDataComponent implements OnInit {

  @Input() acces;
  @Output() dataUpdated = new EventEmitter();

  constructor(
    private spinner: NgxSpinnerService,
    private dataService: DataTransfertService
  ) { }

  ngOnInit(): void {
  }

  update(){
    this.spinner.show();
    this.dataService.updateData().subscribe(
      this.onSuccess,
      this.dataService.onError
    )
  }

  onSuccess = (r)=>{
    this.spinner.hide();
    this.dataUpdated.emit();
    this.dataService.notif.success("Mise à jour effectuée");
  }

  showButton(){
    return this.acces.update;
  }
}

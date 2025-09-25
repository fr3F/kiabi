import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';
import { HistoryStatus } from '../../data';

@Component({
  selector: 'app-list-histories',
  templateUrl: './list-histories.component.html',
  styleUrls: ['./list-histories.component.scss']
})
export class ListHistoriesComponent extends BaseListComponent {

  allStatus = HistoryStatus;
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-consultation-stock',
  templateUrl: './list-consultation-stock.component.html',
  styleUrls: ['./list-consultation-stock.component.scss']
})
export class ListConsultationStockComponent implements OnInit {

  @Input() list;
  listShowed;
  @Output() onExport = new EventEmitter();

  filter = ""; // 1 sans stock magasin, 2 avec stock magasin 
  
  constructor() { }

  ngOnInit(): void {
    this.listShowed = this.list;
  }

  export(){
    this.onExport.emit();
  }

  changeList(){
    if(!this.filter)
      this.listShowed = this.list;
    else if(this.filter == "1")
      this.listShowed = this.list.filter((r)=> !r.stock);
    else if(this.filter == "2")
      this.listShowed = this.list.filter((r)=> r.stock);
    
  }

}

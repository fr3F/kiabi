import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-list-search',
  templateUrl: './list-search.component.html',
  styleUrls: ['./list-search.component.scss']
})
export class ListSearchComponent implements OnInit {

  @Output() onSearch = new EventEmitter<string>();
  @Input() placeholder = "Rechercher"

  motSearch = "";

  constructor() { }

  ngOnInit(): void {
  }

  search(){
    this.onSearch.emit(this.motSearch);
  }
}

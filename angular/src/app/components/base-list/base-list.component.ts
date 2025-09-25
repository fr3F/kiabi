import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-base-list',
  templateUrl: './base-list.component.html',
  styleUrls: ['./base-list.component.scss']
})
export class BaseListComponent implements OnInit {
  actions = ["modifier", "ajouter", "supprimer"]

  constructor() { }

  @Input() fonctionnalites;
  @Input() isVisible;
  @Input() acces;
  tabAfficherAction = [];

  @Output() onChangeItem = new EventEmitter();
  @Input() page;
  @Input() pageSize;
  @Input() count;
  @Input() list;
  @Input() loading;
  plusFiltre = false;

  ngOnInit(): void {
  }

  masquerAction(){
    let rep = true;
    for(let i = 0; i < this.tabAfficherAction.length; i++){
      rep = rep && !this.isVisible(this.tabAfficherAction[i]);
    }
    return rep;
  }


  showAction(){
    for(const action of this.actions){
      if(this.acces[action])
        return true;
    }
    return false;
  }

  changeItem(){
    this.onChangeItem.emit();
  }


}

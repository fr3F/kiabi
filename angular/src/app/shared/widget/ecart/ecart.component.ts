import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ecart',
  templateUrl: './ecart.component.html',
  styleUrls: ['./ecart.component.scss']
})
export class EcartComponent implements OnInit {
  
  @Input() ecart: number

  constructor() { }

  ngOnInit(): void {
  }

  
  get classEcart(){
    if(this.ecart > 0)
      return "badge-soft-success"
    if(this.ecart < 0)
      return "badge-soft-danger"
    return "badge-soft-primary"
  }

  
  get iconEcart(){
    if(this.ecart > 0)
      return "bx-trending-up"
    if(this.ecart < 0)
      return "bx-trending-down"
    return "bx-"
  }

}

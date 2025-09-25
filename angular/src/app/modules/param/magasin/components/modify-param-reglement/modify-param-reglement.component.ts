import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MagasinService } from '../../services/magasin.service';

@Component({
  selector: 'app-modify-param-reglement',
  templateUrl: './modify-param-reglement.component.html',
  styleUrls: ['./modify-param-reglement.component.scss']
})
export class ModifyParamReglementComponent implements OnInit {

  @Input() data;
  @Output() onValidate = new EventEmitter();
  submit = false;
  constructor(
    private magasinService: MagasinService,
  ) { }

  ngOnInit(): void {
  }

  invalid(){
    return !this.data.noreglement || !this.data.codejournal;
  }

  isInvalid(attribute){
    return this.submit && !this.data[attribute];
  }

  validate(){
    this.submit =  true;
    if(this.invalid())
      return;
    this.magasinService.updateParamReglement(this.data).subscribe(
      (r: {dateModification})=>{
        this.data.dateModification = r.dateModification;
        this.magasinService.notif.success("Enregistré");
        this.onValidate.emit(this.data) 
      },
      this.magasinService.onError
    )
  }
}

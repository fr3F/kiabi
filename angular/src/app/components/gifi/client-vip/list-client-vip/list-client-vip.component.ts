import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseListComponent } from 'src/app/components/base-list/base-list.component';
import { ClientVipService } from 'src/app/services/gifi/client-vip.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-list-client-vip',
  templateUrl: './list-client-vip.component.html',
  styleUrls: ['./list-client-vip.component.scss']
})
export class ListClientVipComponent extends BaseListComponent {

  filename = "";
  actions = ["modifier", "ajouter", "supprimer", "activer"]

  constructor(
    private clientVipService: ClientVipService,
    private spinner: NgxSpinnerService,
  ) { 
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.spinner.hide();
  }

  delete(index){
    this.clientVipService.delete(this.list[index].id).subscribe(
      (r)=>{
        this.clientVipService.notif.info("Supprimé");
        this.list.splice(index, 1);
      },
      this.clientVipService.onError
    )
  }

    
  export(){
    this.spinner.show();
    const onSuccessExport = (r)=>{
      const filename = `Client-VIP.xlsx`;
      FileSaver.saveAs(r, filename);
      this.spinner.hide();
    }
    this.spinner.show();
    this.clientVipService.exportExcel().subscribe(
      onSuccessExport,
      this.clientVipService.onError
    )    
  }

  
  addFile($event){
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      let file = target.files[0];
      let me = this;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        me.importFile(reader.result);
      };
    }
  }

  importFile(file){
    this.spinner.show();

    this.clientVipService.importExcel(file).subscribe(
      (r)=>{
        this.spinner.hide();
        this.filename = "";
        this.clientVipService.notif.success("Client importé avec succès");
        this.onChangeItem.emit();
      },
      (err)=>{
        this.clientVipService.onError(err);
        this.filename = "";
      }
    )
  }
}

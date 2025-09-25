import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/services/acces/menu.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-form-acces',
  templateUrl: './form-acces.component.html',
  styleUrls: ['./form-acces.component.scss']
})
export class FormAccesComponent implements OnInit {

  constructor(
    private userServ: UserService,
    private notif: NotificationService,
    private menuServ: MenuService
  ) { }

  ngOnInit(): void {
    this.initializeMenu();
  }

  onError = (err) => {
    this.notif.error(err.message)
  } 

  roles;
  menus;
  roleId = 0;
  modules;


  initializeRoles(){
    const onSuccess = (resp) => { 
      this.roles = resp;
      this.roleId = this.roles[0].id;
      this.initializeMenuRole(); 
      this.getAllModule();
    };
    this.userServ.getRoles().subscribe(onSuccess, this.onError);
  }

  supprimerClient(){
    for(let i = 0; i<this.roles.length; i++){
      if(this.roles[i].id == 3){
        this.roles.splice(i, 1);
        break;
      }
    }
  }

  initializeMenuRole(){
    const onSuccess = (resp) => { 
      let menuRole = resp;
      this.initializeChecked(menuRole, this.menus);
      // console.log(this.menus)
    };
    this.menuServ.getAllMenuRole(this.roleId).subscribe(onSuccess, this.onError);
  }

  initializeChecked(menuRole, menu){
    for(let i = 0; i < menu.length; i++){
      let test = 0;
      this.initializeChecked(menuRole, menu[i].subItems);
      for(let j = 0; j < menuRole.length; j++){
        if(menu[i].id == menuRole[j].id){
          menu[i].checked = true;
          test++;
          break;
        }
      }
      if(test == 0)
        menu[i].checked = false;
    }
  }

  initializeMenu(){
    const onSuccess = (resp) => { 
      this.menus = resp;
      this.initializeRoles();
    };
    this.menuServ.getAllMenu().subscribe(onSuccess, this.onError);
  }

  
  changeRole(event){
      this.roleId = event.target.value;
      // console.log(this.roleId)
      this.initializeMenuRole();
      this.getAllModuleRole();
  }

  changeCheck(menu, ind){
    menu.checked = !menu.checked;
    this.changeCheckSubItems(menu.checked, menu.subItems)
    if(ind.length > 0){
      let parent1 = this.menus[ind[0]];
      this.checkParent(parent1, menu.checked)
    }
    if(ind.length > 1){
      let parent2 = this.menus[ind[0]].subItems[ind[1]];
      this.checkParent(parent2, menu.checked)
    }
  }

  checkParent(parent, checked){
    if(checked)
      parent.checked = true;
    else{
      let nbChecked = 0;
      for(let i = 0; i < parent.subItems.length; i++){
        if(parent.subItems[i].checked)
          nbChecked ++;
      }
      if(nbChecked == 0)
        parent.checked = false;
    }   
  }

  changeCheckSubItems(checked, subItems){
    for(let i = 0; i < subItems.length; i++){
      subItems[i].checked = checked;
      this.changeCheckSubItems(checked, subItems[i].subItems);
    }
  }

  valider(){
    const onSuccess = (resp) => { 
      this.notif.success("Enregistré avec succès");
      setTimeout(() =>{
        window.location.reload();
      }, 1000)
    };
    this.menuServ.updateAcces(this.roleId, this.menus, this.modules)
      .subscribe(onSuccess, this.onError);
  }

  
  getAllModule(){
    const onSuccess = (resp) => { 
      this.modules = resp;
      this.getAllModuleRole();
    };
    this.menuServ.getAllModuleAvecFonctionnalite().subscribe(onSuccess, this.onError);
  }

  getAllModuleRole(){
    const onSuccess = (resp) => { 
      this.initializeCheckedFonctionnalites(resp);    
    };
    this.menuServ.getFonctionnaliteRole(this.roleId).subscribe(onSuccess, this.onError);
  }

  
  initializeCheckedFonctionnalites(fonctionnalites){
    for(let i = 0; i < this.modules.length; i++){
      for(let j = 0; j < this.modules[i].fonctionnalites.length; j ++){
        let test = 0;
        for(let k = 0; k < fonctionnalites.length; k++){
          if(fonctionnalites[k].fonctionnaliteId == this.modules[i].fonctionnalites[j].id){
            this.modules[i].fonctionnalites[j].checked = true;
            test++;
            break;
          }
        }
        if(test == 0)
          this.modules[i].fonctionnalites[j].checked = false;
      }
    }
    // console.log(fonctionnalites)
  }

  
  changeCheckFonctionnalite(f){
    f.checked = !f.checked;
  }
}

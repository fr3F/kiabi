import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  show(message, type : SweetAlertIcon = "success") {
    Swal.fire({
      position: 'bottom-end',
      icon: type,
      title: message,
      showConfirmButton: false,
      showCloseButton: true,
      timer: 2000
    });
  }

  success(message){
    this.show(message, "success");
  }
  
  error(message){
    this.show(message, "error");
  }

  warning(message){
    this.show(message, "warning");
  }

  info(message){
    this.show(message, "info");
  }
  
}

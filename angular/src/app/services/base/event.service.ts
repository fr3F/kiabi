import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  onRefreshHistory = new EventEmitter();
  constructor() { }
  
}

import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { io, Socket } from "socket.io-client";

export interface InventaireSummary {
  introuvable;
  surplusnonExistant;
  surplus: number;
  surplusTotal: number;
  progress: number;
  countRows?: number;
}

@Injectable({ providedIn: "root" })
export class InventaireSocketService {
  private socket: Socket;
  private socketUrl = "http://192.168.2.41:8104";

  private dataSubject = new Subject;
  private summarySubject = new Subject;

  constructor() {
    this.socket = io(this.socketUrl);

    this.socket.on("inventaireData", (data) => {
      this.dataSubject.next(data);
    });

    this.socket.on("inventaireSummary", (data) => {
      this.summarySubject.next(data);
    });
  }

  joinInventaire(idinventaire) {
    this.socket.emit("joinInventaire", idinventaire);
  }

  leaveInventaire(idinventaire) {
    this.socket.emit("leaveInventaire", idinventaire);
  }

  onInventaireData() {
    return this.dataSubject.asObservable();
  }

  onInventaireSummary(){
    return this.summarySubject.asObservable();
  }
}

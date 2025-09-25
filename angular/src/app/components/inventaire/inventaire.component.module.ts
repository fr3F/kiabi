import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    // ListeInventaireComponent,
    // ListesInventairesPageComponent // si ce composant appartient à ce module
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgbPaginationModule,
    NgxSpinnerModule,
    NgApexchartsModule 
    // ✅

  ],
  exports: [
    // ListeInventaireComponent // <- pour que d'autres modules puissent l'utiliser
  ]
})
export class InventaireComponentModule { }


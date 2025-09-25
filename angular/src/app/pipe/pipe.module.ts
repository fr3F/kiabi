import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from './safe.pipe';
import { AppcurrencyPipe } from './custom.currencypipe';



@NgModule({
  declarations: [SafePipe, AppcurrencyPipe],
  imports: [
    CommonModule
  ],
  exports: [SafePipe, AppcurrencyPipe]
})
export class PipeModule { }

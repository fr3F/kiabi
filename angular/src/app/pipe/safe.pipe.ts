import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }
  transform(url) :SafeHtml  {
    console.log(url);
    console.log(this.sanitizer.bypassSecurityTrustResourceUrl(url));
   return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

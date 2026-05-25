import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'typeAssists'
})
export class TypeAssistsPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: any): unknown {
    
    return `assists--${value}`

  }
}

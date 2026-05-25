import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'fisrtLetter'
})
export class FisrtLetterPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(name: string): string {

    if (name == "" || name == null)
      return "P"

    return name.charAt(0).toUpperCase()

  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'statusColor'
})
export class StatusColorPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: any): unknown {

    const COLOR_STATUS = {
      1: "success",
      0: "warning"
    }

    return this.sanitizer.bypassSecurityTrustHtml(`phase-line__icon--${COLOR_STATUS[value]}`);

  }
}

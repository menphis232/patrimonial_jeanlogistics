import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'supportPreview'
})
export class supportPreviewPipe implements PipeTransform {
 
  private supports = [
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];

  transform(value: string, ...args: unknown[]): boolean {
    if(this.supports.includes(value)){
      return true
    }
    return false;
  }

}

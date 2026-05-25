import { AbstractControl } from "@angular/forms";

export const minLengthArray = (min: number = 1) => {
    return (c: AbstractControl): {[key: string]: any} => {
  
      if (c.value.length >= min)
        return null;
  
      return { MinLengthArray: true};
    }
  }
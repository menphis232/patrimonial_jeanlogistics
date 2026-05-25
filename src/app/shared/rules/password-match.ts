import { AbstractControl } from "@angular/forms";

export const passwordMatch = (controlName: string) => {
    
    return (c: AbstractControl): {[key: string]: any} => {

      if(!c.parent){
          return null;
      }

      if (c?.value?.trim() === c.parent.controls[controlName]?.value?.trim() || false)
        return null;
  
      return { passwordMatch: true };
    }
}

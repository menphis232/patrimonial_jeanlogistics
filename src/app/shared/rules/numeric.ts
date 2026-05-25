import { AbstractControl } from "@angular/forms";

export const numeric = () => {
    return (control: AbstractControl): {[key: string]: any} => {

      const regex = /^-?\d*[.,]?\d{0,2}$/;

      if (control.value == null || control.value == '' || regex.test(control.value))
        return null;
      
      return { numeric: true};
    }
}
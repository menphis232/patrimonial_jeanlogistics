import { Component, Input, Optional } from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { format } from 'date-fns';

@Component({
  selector: '[errorSpan]',
  templateUrl: './error-span.component.html',
  styleUrls: ['./error-span.component.scss']
})
export class ErrorSpanComponent {

  @Input () controlName: string;

  constructor(
    @Optional() private controlContainer: ControlContainer
  ) { }

  get form(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get control(): FormControl {
    return this.form.get(this.controlName) as FormControl;
  }

  get currentDate() {
    return format(new Date(), 'dd-MM-yyyy')
  }
  
}

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
  selector: '[spinner]'
})
export class SmallSpinnerDirective {

  @Input() set spinner(loading: boolean) {
    this.viewInit(loading)
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) { 
  }

  viewInit(loading){
    this.viewContainer.clear()
    
    if(loading){
      const componentSpinner = this.viewContainer.createComponent(MatProgressSpinner)
            componentSpinner.instance.diameter = 20
            componentSpinner.instance.mode     = 'indeterminate'
            componentSpinner.instance._elementRef.nativeElement.classList.add('mr-1')
    }
    else{
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

}

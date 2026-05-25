import { Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from 'src/app/core/user/user.service';


@Directive({
  selector: '[canPermission]'
})
export class CanPermissionDirective {
  
  private permissionsCurrent: string[] = []

  @Input() 
  set canPermission(values: string[]) {
    
    this.permissionsCurrent = values
    this.updateView();

  }

  constructor(
    private _userService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {

  }

  updateView(){
    if(this._userService.hasPermissions(this.permissionsCurrent)){
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }

}

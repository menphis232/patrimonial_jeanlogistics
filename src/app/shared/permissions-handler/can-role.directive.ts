import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from 'src/app/core/user/user.service';


@Directive({
  selector: '[canRole]'
})
export class CanRoleDirective {

  private roleCurrent: string[] = []

  @Input() 
  set canRole(values: string[]) {
    
    this.roleCurrent = values
    this.updateView();

  }

  constructor(
    private _userService: UserService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {

  }

  updateView(){
    if(this._userService.hasRoles(this.roleCurrent)){
      this.viewContainer.createEmbeddedView(this.templateRef)
    }
  }
  
}

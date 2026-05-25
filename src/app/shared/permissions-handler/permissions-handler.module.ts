import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanPermissionDirective } from './can-permission.directive';
import { CanRoleDirective } from './can-role.directive';

@NgModule({
  declarations: [CanPermissionDirective, CanRoleDirective],
  imports: [
    CommonModule
  ],
  exports: [
    CanPermissionDirective,
    CanRoleDirective,
  ]
})
export class PermissionsHandlerModule { }

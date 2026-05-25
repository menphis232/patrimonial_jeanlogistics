import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ValidateIncapacityComponent } from './pages/validate-incapacity/validate-incapacity.component';
import { IncapacityRoutes } from './incapacity.routing';
import { ListIncapacityComponent } from './pages/list-incapacity/list-incapacity.component';

@NgModule({
  declarations: [
    ValidateIncapacityComponent,
    ListIncapacityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(IncapacityRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class IncapacityModule {}

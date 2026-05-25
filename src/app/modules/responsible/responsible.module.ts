import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResponsibleRoutes } from './responsible.routing';
import { ListResponsibleComponent } from './pages/list-responsible/list-responsible.component';
import { FormResponsibleComponent } from './pages/form-responsible/form-responsible.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ListResponsibleComponent,
    FormResponsibleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ResponsibleRoutes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TablerIconsModule,
    SharedModule
  ]
})
export class ResponsibleModule { } 

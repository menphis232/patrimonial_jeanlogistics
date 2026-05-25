import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListActionsComponent } from './pages/list-actions/list-actions.component';
import { ListGeneralActionsComponent } from './pages/list-general-actions/list-general-actions.component';
import { ActionsRoutes } from './actions.routing';
import { ListResponsibleActionsComponent } from './pages/list-responsible-actions/list-responsible-actions.component';

@NgModule({
  declarations: [
    ListActionsComponent,
    ListGeneralActionsComponent,
    ListResponsibleActionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ActionsRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class ActionsModule {}

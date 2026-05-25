import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperationChangeRoutes } from './operation-change.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListOperationChangeComponent } from './pages/list-operation-change/list-operation-change.component';
import { StoreOperationChangeComponent } from './pages/store-operation-change/store-operation-change.component';
import { SetControlsComponent } from './components/set-controls/set-controls.component';

@NgModule({
  declarations: [
    ListOperationChangeComponent,
    StoreOperationChangeComponent,
    SetControlsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(OperationChangeRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class OperationChangeModule {}

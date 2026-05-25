import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivePricipleRoutes, } from './active-principle.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListActivePrincipleComponent } from './pages/list-active-principle/list-active-principle.component';
import { StoreActivePrincipleComponent } from './pages/store-active-principle/store-active-principle.component';

@NgModule({
  declarations: [
    ListActivePrincipleComponent,
    StoreActivePrincipleComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ActivePricipleRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class ActivePrincipleModule {}

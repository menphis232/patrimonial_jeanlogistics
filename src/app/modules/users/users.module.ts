import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { UsersRoutes } from './users.routing';
import { StoreUsersComponent } from './pages/store-users/store-users.component';
import { ListUsersComponent } from './pages/list-users/list-users.component';

@NgModule({
  declarations: [
    StoreUsersComponent,
    ListUsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(UsersRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class UsersModule {}

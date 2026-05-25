import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitpassRoutes } from './exitpass.routing';
import { StoreExitpassComponent } from './pages/store-exitpass/store-exitpass.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    StoreExitpassComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ExitpassRoutes),
    MaterialModule,
    SharedModule
  ],
  providers:[provideNativeDateAdapter()]
})
export class ExitpassModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReportsRoutes } from './reports.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListReportsComponent } from './pages/list-reports/list-reports.component';
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    ListReportsComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    MaterialModule,
    SharedModule
  ],
  exports:[],
  providers:[provideNativeDateAdapter()]
})
export class ReportsModule { }

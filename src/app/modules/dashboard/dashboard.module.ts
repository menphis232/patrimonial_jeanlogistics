import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './pages/main/main.component';
import { dashboardRouting } from './dashboard.routing';
import {NgApexchartsModule} from 'ng-apexcharts';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule.forChild(dashboardRouting),
    MainComponent,
    NgApexchartsModule,
    SharedModule
  ],
})
export class DashboardModule {}

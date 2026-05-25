import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutes } from './employee.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListEmployeeComponent } from './pages/list-employee/list-employee.component';
import { StoreEmployeeComponent } from './pages/store-employee/store-employee.component';
import { DetailEmployeeComponent } from './pages/detail-employee/detail-employee.component';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ListGeneralConsultationComponent } from '../general-consultation/pages/list-general-consultation/list-general-consultation.component';
import { GeneralConsultationModule } from '../general-consultation/general-consultation.module';
import { ErgonomicModule } from '../ergonomic/ergonomic.module';

@NgModule({
  declarations: [
    ListEmployeeComponent,
    StoreEmployeeComponent,
    DetailEmployeeComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(EmployeeRoutes),
    MaterialModule,
    SharedModule,


  ],
  exports:[],
  providers:[provideNativeDateAdapter()]
})
export class EmployeeModule {}

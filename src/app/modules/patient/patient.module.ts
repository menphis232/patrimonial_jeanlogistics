import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutes } from './patient.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListPatientComponent } from './pages/list-patient/list-patient.component';
import { StorePatientComponent } from './pages/store-patient/store-patient.component';
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    ListPatientComponent,
    StorePatientComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(PatientRoutes),
    MaterialModule,
    SharedModule
  ],
  exports:[],
  providers:[provideNativeDateAdapter()]
})
export class PatientModule {}

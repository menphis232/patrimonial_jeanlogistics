import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementRoutes } from './measurement.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListMeasurementComponent } from './pages/list-measurement/list-measurement.component';
import { StoreMeasurementComponent } from './pages/store-measurement/store-measurement.component';

@NgModule({
  declarations: [
    ListMeasurementComponent,
    StoreMeasurementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MeasurementRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class MeasurementModule {}

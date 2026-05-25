import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { AreasRoutes } from './areas.routing';
import { ListAreasComponent } from './pages/list-areas/list-areas.component';
import { StoreAreasComponent } from './pages/store-areas/store-areas.component';

@NgModule({
  declarations: [
    StoreAreasComponent,
    ListAreasComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AreasRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class AreasModule {}

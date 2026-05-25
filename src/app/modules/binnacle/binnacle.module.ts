import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BinnacleRoutes } from './binnacle.routing';
import { ListBinnacleComponent } from './pages/list-binnacle/list-binnacle.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {provideNativeDateAdapter} from '@angular/material/core';

@NgModule({
  declarations: [
    ListBinnacleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BinnacleRoutes),
    MaterialModule,
    SharedModule
  ],
  providers:[provideNativeDateAdapter()]
})
export class BinnacleModule { }

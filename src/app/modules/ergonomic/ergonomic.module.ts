import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErgonomicRoutes } from './ergonomic.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ListErgonomicComponent } from './pages/list-ergonomic/list-ergonomic.component';
import { StoreErgonomicComponent } from './pages/store-ergonomic/store-ergonomic.component';
import { ListToursComponent } from './pages/list-tours/list-tours.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ListErgonomicComponent,
    StoreErgonomicComponent,
    ListToursComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ErgonomicRoutes),
    MaterialModule,
    SharedModule,
    MatTooltipModule
  ],
  exports:[
    // ListErgonomicComponent
  ],
  providers:[provideNativeDateAdapter()]
})
export class ErgonomicModule { }

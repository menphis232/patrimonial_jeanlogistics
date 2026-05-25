import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawerService } from './services/drawer.service';
import { MaterialModule } from 'src/app/material.module';
import { DrawerContainerComponent } from './drawer-container/drawer-container.component';



@NgModule({
  declarations: [
    DrawerContainerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  exports: [
    DrawerContainerComponent,
  ],
  providers: [
    DrawerService
  ]
})
export class DrawerModule { }

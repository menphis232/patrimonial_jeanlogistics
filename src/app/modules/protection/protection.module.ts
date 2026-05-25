import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProtectionRoutes } from './protection.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { StoreProtectionComponent } from './pages/store-protection/store-protection.component';
import { ListProtectionComponent } from './pages/list-protection/list-protection.component';


@NgModule({
  declarations: [
    ListProtectionComponent,
    StoreProtectionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ProtectionRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class ProtectionModule {}

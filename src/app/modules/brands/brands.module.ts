import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsRoutes } from './brands.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { StoreBrandsComponent } from './pages/store-brands/store-brands.component';
import { ListBrandsComponent } from './pages/list-brands/list-brands.component';

@NgModule({
  declarations: [
    StoreBrandsComponent,
    ListBrandsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BrandsRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class BrandsModule {}

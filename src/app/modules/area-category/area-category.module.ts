import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ListAreaCategoryComponent } from './pages/list-area-category/list-area-category.component';
import { FormAreaCategoryComponent } from './pages/form-area-category/form-area-category.component';
import { AreaCategoryRoutes } from './area-category.routing';

@NgModule({
  declarations: [
    ListAreaCategoryComponent,
    FormAreaCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AreaCategoryRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class AreaCategoryModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { StoreCategoryComponent } from './pages/store-category/store-category.component';
import { ListCategoryComponent } from './pages/list-category/list-category.component';
import { ListTurnsComponent } from './pages/list-turns/list-turns.component';
import { StoreTurnComponent } from './pages/store-turn/store-turn.component';
import { CategoryRoutes } from './category.routing';
import { ModalQrGuardsComponent } from './components/modal-qr-guards/modal-qr-guards.component';

@NgModule({
  declarations: [
    StoreCategoryComponent,
    ListCategoryComponent,
    ListTurnsComponent,
    StoreTurnComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CategoryRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class CategoryModule {}

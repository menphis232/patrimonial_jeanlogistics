import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesRoutes } from './articles.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListArticlesComponent } from './pages/list-articles/list-articles.component';
import { StoreArticlesComponent } from './pages/store-articles/store-articles.component';

@NgModule({
  declarations: [
    ListArticlesComponent,
    StoreArticlesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ArticlesRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class ArticlesModule {}

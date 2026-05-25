import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockRoutes } from './stock.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { StoreStockComponent } from './pages/store-stock/store-stock.component';
import { ListStockComponent } from './pages/list-stock/list-stock.component';


@NgModule({
  declarations: [
    ListStockComponent,
    StoreStockComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(StockRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class StockModule {}

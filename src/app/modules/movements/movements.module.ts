import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovementsRoutes } from './movements.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { StoreMovementsComponent } from './pages/store-movements/store-movements.component';
import { ListMovementsComponent } from './pages/list-movements/list-movements.component';
import { MovementDetailModalComponent } from './components/movement-detail-modal/movement-detail-modal.component';


@NgModule({
  declarations: [
    ListMovementsComponent,
    StoreMovementsComponent,
    MovementDetailModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(MovementsRoutes),
    MaterialModule,
    SharedModule
  ]
})
export class MovementsModule {}

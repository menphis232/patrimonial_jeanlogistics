import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpedientsRoutes } from './expedients.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ListExpedientsComponent } from './pages/list-expedients/list-expedients.component';
import { StoreExpedientsComponent } from './pages/store-expedients/store-expedients.component';
import { ListToursComponent } from './pages/list-tours/list-tours.component';
import { ModalQrGuardsComponent } from './components/modal-qr-guards/modal-qr-guards.component';
import { ModalDetailToursComponent } from './components/modal-detail-tours/modal-detail-tours.component';

@NgModule({
  declarations: [
    ListExpedientsComponent,
    StoreExpedientsComponent,
    ListToursComponent,
    ModalQrGuardsComponent,
    ModalDetailToursComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ExpedientsRoutes),
    MaterialModule,
    SharedModule,
    MatTooltipModule
  ],
  providers: [provideNativeDateAdapter()]
})
export class ExpedientsModule { }


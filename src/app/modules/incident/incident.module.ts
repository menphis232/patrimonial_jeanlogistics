import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentRoutes } from './incident.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ListIncidentComponent } from './pages/list-incident/list-incident.component';
import { StoreIncidentComponent } from './pages/store-incident/store-incident.component';
import { ModalDetailIncidentComponent } from './components/modal-detail-incident/modal-detail-incident.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    ListIncidentComponent,
    StoreIncidentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(IncidentRoutes),
    MaterialModule,
    SharedModule,
    MatChipsModule,
    ModalDetailIncidentComponent
  ],
  providers: [provideNativeDateAdapter()]
})
export class IncidentModule { }

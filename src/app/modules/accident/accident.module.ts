import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccidentRoutes } from './accident.routing';
import { ListAccidentComponent } from './pages/list-accident/list-accident.component';
import { StoreAccidentComponent } from './pages/store-accident/store-accident.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ModalDetailAccidentComponent } from './components/modal-detail-accident/modal-detail-accident.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ListAccidentComponent,
    StoreAccidentComponent,
    ModalDetailAccidentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(AccidentRoutes),
    MaterialModule,
    SharedModule,
    TablerIconsModule,
    MatDialogModule
  ],
  providers: [
    provideNativeDateAdapter(),
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccidentModule { }

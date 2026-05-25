import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralConsultationRoutes } from './general-consultation.routing';
import { ListGeneralConsultationComponent } from './pages/list-general-consultation/list-general-consultation.component';
import { StoreGeneralConsultationComponent } from './pages/store-general-consultation/store-general-consultation.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import {provideNativeDateAdapter} from '@angular/material/core';
import { ModalDetailGeneralComponent } from './components/modal-detail-general/modal-detail-general.component';

@NgModule({
  declarations: [
    ListGeneralConsultationComponent,
    StoreGeneralConsultationComponent,

  ],
  imports: [
    CommonModule,
    RouterModule.forChild(GeneralConsultationRoutes),
    MaterialModule,
    SharedModule,

  ],
  // exports:[
  //   ListGeneralConsultationComponent,
  // ],
  providers:[provideNativeDateAdapter()]
})
export class GeneralConsultationModule { }

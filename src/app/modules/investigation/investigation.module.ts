import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InvestigationRoutes } from './investigation.routing';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from 'src/app/material.module';
import { ListInvestigationComponent } from './pages/list-investigation/list-investigation.component';
import { StoreInvestigationComponent } from './pages/store-investigation/store-investigation.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TablerIconsModule } from 'angular-tabler-icons';

@NgModule({
  declarations: [
    ListInvestigationComponent,
    StoreInvestigationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(InvestigationRoutes),
    MaterialModule,
    SharedModule,
    TablerIconsModule
  ],
  exports:[],
  providers:[
    provideNativeDateAdapter(),
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InvestigationModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ActionDetailComponent } from './pages/action-detail/action-detail.component';
import { ActionService } from './services/action.service';

@NgModule({
  declarations: [
    ActionDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [
    ActionService
  ]
})
export class AuthModule { } 
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CAsyncSelectComponent } from './c-async-select/c-async-select.component';
import { CSelectComponent } from './c-select/c-select.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CSelectService } from './c-select.service';


@NgModule({
  declarations: [CAsyncSelectComponent, CSelectComponent],
  imports: [
    NgSelectModule,
    CommonModule,
    FormsModule
  ],
  exports: [
    CAsyncSelectComponent,
    CSelectComponent,
  ],
  providers: [
    CSelectService,
  ]
})
export class CSelectModule { }

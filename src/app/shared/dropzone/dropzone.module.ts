import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropzoneComponent } from './dropzone.component';
import { ProgressComponent } from './progress/progress.component';
import { DndDirective } from './directives/dnd.directive';
import { supportPreviewPipe } from './pipes/support-preview.pipe';

import { GalleryModule } from  'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';

@NgModule({
  declarations: [DropzoneComponent, ProgressComponent, DndDirective, supportPreviewPipe],
  imports: [
    CommonModule,
    GalleryModule,
    LightboxModule,
    MaterialModule,
    TablerIconsModule
  ],
  exports: [
    DropzoneComponent
  ],
  providers: [
    supportPreviewPipe
  ]
})
export class DropzoneModule { }

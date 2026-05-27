import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchFieldComponent } from './components/search-field/search-field.component'; 
import { ErrorSpanComponent } from './components/error-span/error-span.component';
import { CSelectModule } from './c-select/c-select.module';
import { DropzoneModule } from './dropzone/dropzone.module';
import { PermissionsHandlerModule } from './permissions-handler/permissions-handler.module';
import { SmallSpinnerDirective } from './directives/small-spinner.directive';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { DrawerModule } from './drawer/drawer.module';
import { PipesModule } from './pipes/pipes.module';

// icons
import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { MaterialModule } from '../material.module';
import { ExamsComponent } from './components/exams/exams.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ImageViewerDialogComponent } from './components/image-viewer-dialog/image-viewer-dialog.component';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CSelectModule,
        DropzoneModule,
        MaterialModule,
        PdfViewerModule,
        ToastrModule.forRoot(),
        TablerIconsModule.pick(TablerIcons),
        // PdfViewerComponent
        
        
    ],
    exports: [
        /**
         * Modules
         */
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CSelectModule,
        DropzoneModule,
        PermissionsHandlerModule,
        ToastrModule,
        NgSelectModule,
        PdfViewerModule,
        DrawerModule,
        TablerIconsModule,

        /**
        * Components
        */
        SearchFieldComponent,
        ErrorSpanComponent,
        ExamsComponent,
         PdfViewerComponent,
        ImageViewerDialogComponent,

        /**
         * Directives
         */
         SmallSpinnerDirective,

         /**
          * Pipes
          */
        PipesModule
    ],
    declarations: [
      SearchFieldComponent,
      ErrorSpanComponent,
      SmallSpinnerDirective,

      ExamsComponent,
       PdfViewerComponent,
      ImageViewerDialogComponent,
    ],
    providers: [
    ]
})
export class SharedModule
{
}

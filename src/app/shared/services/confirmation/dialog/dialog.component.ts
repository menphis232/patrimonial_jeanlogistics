import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationConfig } from '../confirmation.types';
import { CommonModule } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';


@Component({
    selector     : 'confirmation-dialog',
    templateUrl  : './dialog.component.html',
    styleUrls: ['./dialog.component.scss'],
    standalone: true,
    imports: [RouterModule, CommonModule, TablerIconsModule, MaterialModule],
    encapsulation: ViewEncapsulation.None
})
export class ConfirmationDialogComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ConfirmationConfig,
        public matDialogRef: MatDialogRef<ConfirmationDialogComponent>
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

}

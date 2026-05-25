import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'lodash-es';
import { ConfirmationConfig } from './confirmation.types';
import { ConfirmationDialogComponent } from './dialog/dialog.component';


@Injectable({
    providedIn: 'root'
})
export class ConfirmationService
{
    private _defaultConfig: ConfirmationConfig = {
        title      : 'Confirm action',
        message    : 'Are you sure you want to confirm this action?',
        icon       : {
            show : true,
            name : 'alert-triangle',
            color: 'warning'
        },
        actions    : {
            confirm: {
                show : true,
                label: 'Confirm',
                color: 'warn'
            },
            cancel : {
                show : true,
                label: 'Cancel'
            }
        },
        dismissible: false
    };

    /**
     * Constructor
     */
    constructor(
        private _matDialog: MatDialog
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(config: ConfirmationConfig = {}): MatDialogRef<ConfirmationDialogComponent>
    {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(ConfirmationDialogComponent, {
            autoFocus   : false,
            disableClose: !userConfig.dismissible,
            data        : userConfig,
            panelClass  : 'fuse-confirmation-dialog-panel'
        });
    }


  /**
   * Muestra ventana de dialogo para confirm dialog de Fuse
   */
  dialogConfirm(title: string = "Confirmar"){
    return this.open({
        title,
        message: '¿Está seguro de qué desea realizar esta acción?',
        icon: {
          show: true,
          name: 'alert-triangle',
          color: 'warning'
        },
        actions: {
          confirm: {
              show: true,
              label: 'Confirmar',
              color: 'primary'
          },
          cancel: {
              show: true,
              label: 'Cancelar',
          }
        },
        dismissible: false,
    });
  }  
  
  /**
   * Muestra ventana de dialogo para confirm dialog de Fuse
   */
  dialogRemove(){
    return this.open({
        title: 'Eliminar',
        message: '¿Está seguro de qué desea eliminar este registro permanentemente?',
        icon: {
          show: true,
          name: 'trash',
          color: 'error'
        },
        actions: {
          confirm: {
              show: true,
              label: 'Confirmar',
              color: 'primary'
          },
          cancel: {
              show: true,
              label: 'Cancelar',
          }
        },
        dismissible: false,
    });
  }
}

import { NgFor, NgIf, CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccidentService } from '../../services/accident.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-detail-accident',
  templateUrl: './modal-detail-accident.component.html',
  styleUrls: ['./modal-detail-accident.component.scss']
})
export class ModalDetailAccidentComponent implements OnInit {

  public id: string;
  public patient: any | null = null;
  rutaImagen=environment.apiurl+'files/download/';
  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalDetailAccidentComponent>, 
    private _accidentService: AccidentService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {

    this.id = data.id;
  }


  ngOnInit(): void {
    this._accidentService.show(this.id).subscribe((patient) => this.patient = patient)
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}



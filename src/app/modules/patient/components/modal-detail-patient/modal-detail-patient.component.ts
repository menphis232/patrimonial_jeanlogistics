import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PatientService } from '../../services/patient.service';


@Component({
  selector: 'app-modal-detail-patient',
  standalone: true,
  imports: [
    RouterModule, 
    TablerIconsModule, 
    MaterialModule,
    NgFor, 
    NgIf,
    SharedModule
  ],
  templateUrl: './modal-detail-patient.component.html',
  styleUrls: ['./modal-detail-patient.component.scss'],
})
export class ModalDetailPatientComponent implements OnInit {

  public id: string;
  public patient: any | null = null;

  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalDetailPatientComponent>, 
    private _patientService: PatientService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {

    this.id = data.id;
  }


  ngOnInit(): void {
    this._patientService.show(this.id).subscribe((patient) => this.patient = patient)
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}


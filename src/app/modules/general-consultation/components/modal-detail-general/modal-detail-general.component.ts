import { NgFor, NgIf } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GeneralConsultationService } from '../../services/general-consultation.service';

@Component({
  selector: 'app-modal-detail-general',
  templateUrl: './modal-detail-general.component.html',
<<<<<<< HEAD
  // standalone: true,
  // imports: [
  //   RouterModule, 
  //   TablerIconsModule, 
  //   MaterialModule,
  //   NgFor, 
  //   NgIf,
  //   SharedModule
  // ],
=======
  standalone: true,
  imports: [
    RouterModule, 
    TablerIconsModule, 
    MaterialModule,
    NgFor, 
    NgIf,
    SharedModule
  ],
>>>>>>> 6a33427 (fix)
  styleUrls: ['./modal-detail-general.component.scss']
})
export class ModalDetailGeneralComponent implements OnInit {

  public id: string;
  public patient: any | null = null;

  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalDetailGeneralComponent>, 
    private _generalService: GeneralConsultationService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {

    this.id = data.id;
  }


  ngOnInit(): void {
    this._generalService.show(this.id).subscribe((patient) => this.patient = patient)
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}





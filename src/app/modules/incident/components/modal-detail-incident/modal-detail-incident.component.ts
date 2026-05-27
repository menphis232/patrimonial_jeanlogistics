import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject, Optional, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncidentService } from '../../services/incident.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-detail-incident',
  templateUrl: './modal-detail-incident.component.html',
  styleUrls: ['./modal-detail-incident.component.scss'],
  standalone: true,
  imports: [CommonModule, MaterialModule, SharedModule]
})
export class ModalDetailIncidentComponent implements OnInit {

  public id: string;
  public patient: any | null = null;
  rutaImagen=environment.apiUrl+'/files/download/';
  constructor(
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<ModalDetailIncidentComponent>, 
    private _incidentService: IncidentService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data
  ) {

    this.id = data.id;
  }


  ngOnInit(): void {
    this._incidentService.show(this.id).subscribe((patient) => {this.patient = patient.data})

    
  }


  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }
}




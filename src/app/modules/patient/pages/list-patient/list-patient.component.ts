import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { PatientService } from '../../services/patient.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalDetailPatientComponent } from '../../components/modal-detail-patient/modal-detail-patient.component';

@Component({
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrls: ['./list-patient.component.scss'],
})

export class ListPatientComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'code',
    'name',
    'permanent_admin_employees',
    'permanent_operative_employees',
    'temporal_admin_employees',
    'temporal_operative_employees',
    'unionized_admin_employees',
    'unionized_operative_employees',
    'actions'
  ];
  constructor(
    public dialog: MatDialog,
    private _patientService: PatientService,
    private _confirmation: ConfirmationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  get patients$(): Observable<any[]> {
    return this.pagination.data$
  }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate())
    this.pagination.next()
  }

/**
  * After view init
  */
  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page])
  }


  paginate(): void {

    this._patientService.list(this.pagination);
  }

  /**
  * Remove record
  * 
  * @param {string} name Nombre del archivo
  */
  destroy(id: string) {
    const dialogRef = this._confirmation.dialogRemove()

    dialogRef.afterClosed().subscribe((result) => {

      if (result != 'confirmed')
        return;

      this._patientService.delete(id).subscribe((response) => this.paginate());

    });
  }

  download(id) {
    this._patientService.download(id);
  }

  openDialog(idPatient: any): void {
   
    const dialogRef = this.dialog.open(ModalDetailPatientComponent, {
      data: {
        id: idPatient
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
  }


}

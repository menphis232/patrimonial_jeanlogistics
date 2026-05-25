import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { OperationChangeService } from '../../services/operation-change.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDetailPatientComponent } from 'src/app/modules/patient/components/modal-detail-patient/modal-detail-patient.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-list-operation-change',
  templateUrl: './list-operation-change.component.html',
  styleUrls: ['./list-operation-change.component.scss'],
})
export class ListOperationChangeComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination

  constructor(
    private _operationChangeService: OperationChangeService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog
  ) {}

  get operationChange$(): Observable<any[]> {
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
    this.pagination.perPage = 9;
    this._operationChangeService.list(this.pagination);
  }

  showPatientDetail(idPatient: any): void {
   
    const dialogRef = this.dialog.open(ModalDetailPatientComponent, {
      data: {
        id: idPatient
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
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

      this._operationChangeService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }
}

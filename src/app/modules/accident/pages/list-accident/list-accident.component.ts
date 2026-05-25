import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { AccidentService } from '../../services/accident.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { ModalDetailAccidentComponent } from '../../components/modal-detail-accident/modal-detail-accident.component';
@Component({
  selector: 'app-list-accident',
  templateUrl: './list-accident.component.html',
  styleUrls: ['./list-accident.component.scss']
})
export class ListAccidentComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination

  public displayedColumns: string[] = [
    'name',
    'weekly_salary',
    'overtime_salary',
    'imss',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    private _accidentService: AccidentService,
    private _confirmation: ConfirmationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  get collaborators$(): Observable<any[]> {
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

    this._accidentService.list(this.pagination);
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

      this._accidentService.delete(id).subscribe((response) => this.paginate());

    });
  }

  download(id) {
    // console.log('descarga')
    this._accidentService.download(id);
  }

  // openDialog(obj: any): void {
   
  //   const dialogRef = this.dialog.open(ModalDetailComponent, {
  //     data: obj,
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
    
  //   });
  // }
  openDialog(idPatient: any): void {
   
    const dialogRef = this.dialog.open(ModalDetailAccidentComponent, {
      data: {
        id: idPatient
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
  }

}


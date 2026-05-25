import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { BinnacleService } from '../../services/binnacle.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-list-binnacle',
  templateUrl: './list-binnacle.component.html',
  styleUrls: ['./list-binnacle.component.scss']
})
export class ListBinnacleComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'date',
    'name',
    'gender',
    'actually_workspace',
    'work_unit',
    'manager',
    'area',
    'inmediate_boss',
    'diagnoses',
    'type_attention',
    'medical_note',
    'treatment',
    'attended',
    'actions'
  ];

  constructor(
    public dialog: MatDialog,
    private _binnacleService: BinnacleService,
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

    this._binnacleService.list(this.pagination);
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

      this._binnacleService.delete(id).subscribe((response) => this.paginate());

    });
  }

  download(id) {
    this._binnacleService.download(id);
  }

 


}


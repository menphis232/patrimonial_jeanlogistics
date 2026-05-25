import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ModalQrGuardsComponent } from '../../components/modal-qr-guards/modal-qr-guards.component';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
})
export class ListCategoryComponent implements OnInit {
  
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'code',
    'farm',
    'name',
    'turn',
    'actions'
  ];
  constructor(
    private _categoryService: CategoryService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
  ) {}

  get categories$(): Observable<any[]> {
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
    this._categoryService.list(this.pagination);
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

      this._categoryService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }

  openDialog(idPatient: any,qr:any): void {
   
    const dialogRef = this.dialog.open(ModalQrGuardsComponent, {
      data: {
        id: idPatient,
        qr:qr
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
  }

}

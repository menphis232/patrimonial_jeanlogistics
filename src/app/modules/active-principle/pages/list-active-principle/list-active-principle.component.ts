import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ActivePrincipleService } from '../../services/active-principle.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-list-active-principle',
  templateUrl: './list-active-principle.component.html',
  styleUrls: ['./list-active-principle.component.scss'],
})
export class ListActivePrincipleComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination

  constructor(
    private _activePrincipleService: ActivePrincipleService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService
  ) {}

  get activesPrinciples$(): Observable<any[]> {
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
    this._activePrincipleService.list(this.pagination);
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

      this._activePrincipleService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }
}

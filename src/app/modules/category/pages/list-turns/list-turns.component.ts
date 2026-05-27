import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-list-turns',
  template: `
    <mat-card class="cardWithShadow">
      <mat-card-content>
        <div class="row justify-content-between align-items-center mb-4">
          <div class="col-sm-4">
            <app-search-field [pagination]="pagination" class="search-field-custom"></app-search-field>
          </div>
          <div class="col-sm-4 text-end">
            <button mat-flat-button color="primary" [routerLink]="['/category/add/turn']">
              <mat-icon>add</mat-icon>
              Agregar turno
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="cardWithShadow table-container">
      <ng-container *ngIf="(turns$ | async) as turns">
        <ng-container *ngIf="turns.length > 0">
          <div class="table-responsive custom-table">
            <table mat-table [dataSource]="turns" matSort class="w-100">

              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>
                  <span class="header-cell">Nombre</span>
                </th>
                <td mat-cell *matCellDef="let element">
                  {{ element.description | titlecase }}
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns" class="header-row"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns" class="data-row"></tr>
            </table>
          </div>
        </ng-container>

        <ng-container *ngIf="pagination.isLoading">
          <div class="table-loading-records">
            <mat-spinner diameter="40"></mat-spinner>
            <div class="table-loading-records__title">Cargando turnos...</div>
          </div>
        </ng-container>

        <ng-container *ngIf="!pagination.isLoading && turns.length == 0">
          <div class="table-no-records">
            <mat-icon class="icon-40">calendar_off</mat-icon>
            <div class="table-no-records__title">No se encontraron turnos</div>
          </div>
        </ng-container>

        <mat-paginator
          class="custom-paginator"
          [ngClass]="{ hidden: turns.length == 0 }"
          [length]="pagination.total"
          [pageIndex]="pagination.pageIndex"
          [pageSize]="pagination.perPage"
          [pageSizeOptions]="[50, 80, 100]"
          [showFirstLastButtons]="true">
        </mat-paginator>
      </ng-container>
    </mat-card>
  `,
  styles: [`
    .table-container { border-radius: 12px; overflow: hidden; margin-top: 20px; }
    .custom-table { background: white; }
    .header-row { background-color: #f8f9fa; }
    .data-row { transition: background .3s; }
    .data-row:hover { background-color: #f8f9fa !important; }
    .badge { padding: 6px 12px; border-radius: 6px; font-weight: 500; }
    .table-loading-records, .table-no-records { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; color: #666; }
    .table-loading-records__title, .table-no-records__title { margin-top: 16px; font-size: 16px; }
    .custom-paginator { border-top: 1px solid #eee; margin-top: 16px; }
    .icon-40 { font-size: 40px; width: 40px; height: 40px; }
  `]
})
export class ListTurnsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  public pagination: MatPagination = new MatPagination();
  public displayedColumns: string[] = ['name'];

  constructor(
    private _categoryService: CategoryService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService
  ) {}

  get turns$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  paginate(): void {
    this.pagination.perPage = 9;
    this._categoryService.listTurn(this.pagination);
  }

  destroy(id: string): void {
    const dialogRef = this._confirmation.dialogRemove();

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'confirmed') {
        return;
      }

      this._categoryService.delete(id).subscribe(() => {
        this._notificationMessage.success('Se eliminó correctamente');
        this.paginate();
      });
    });
  }
}

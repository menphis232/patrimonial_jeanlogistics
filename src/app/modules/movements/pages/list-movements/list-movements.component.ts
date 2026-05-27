import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MovementsService } from '../../services/movements.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MovementDetailModalComponent } from '../../components/movement-detail-modal/movement-detail-modal.component';

@Component({
  selector: 'app-list-movements',
  templateUrl: './list-movements.component.html',
  styleUrls: ['./list-movements.component.scss'],
})
export class ListMovementsComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  form: FormGroup;

  public pagination: MatPagination = new MatPagination();
  public availableYears: number[] = [];
  public displayedColumns: string[] = ['date', 'farm', 'create_by', 'area', 'actions'];

  constructor(
    private _categoryService: MovementsService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  get categories$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    const ccDefault = JSON.parse(localStorage.getItem('costCenter') || 'null');
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

    this.form = this.fb.group({
      farm: new FormControl(ccDefault, { validators: [Validators.required] }),
      year: new FormControl(currentYear),
    });

    this.form.valueChanges.subscribe(() => this.paginate());
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  get mapData() {
    const formValue = { ...this.form.value };
    return {
      farm_id: formValue.farm?.id,
    };
  }

  paginate(): void {
    this.pagination.perPage = 9;
    this.pagination.params = this.mapData;
    this._categoryService.list(this.pagination);
  }

  destroy(id: string) {
    const dialogRef = this._confirmation.dialogRemove();
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'confirmed') return;
      this._categoryService.delete(id).subscribe(() => {
        this._notificationMessage.success('Se eliminó correctamente');
        this.paginate();
      });
    });
  }

  download(id: number): void {
    this._categoryService.download(id);
  }

  downloadReport(): void {
    const farmId = this.form.get('farm')?.value?.id;
    const year   = this.form.get('year')?.value;
    if (!farmId || !year) return;

    this._categoryService.downloadReport(farmId, year).subscribe({
      next: () => this._notificationMessage.success('Reporte descargado correctamente'),
      error: (err) => {
        console.error('Error descargando reporte:', err);
        this._notificationMessage.error('Error al descargar el reporte');
      }
    });
  }

  showDetails(id: number): void {
    this.dialog.open(MovementDetailModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      maxHeight: '90vh',
      data: { id },
      panelClass: 'movement-detail-dialog',
    });
  }
}

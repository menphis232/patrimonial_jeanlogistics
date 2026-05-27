import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExpedientsService } from '../../services/expedients.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ModalDetailToursComponent } from '../../components/modal-detail-tours/modal-detail-tours.component';
import { format } from 'date-fns';

@Component({
  selector: 'app-list-tours',
  templateUrl: './list-tours.component.html',
  styleUrls: ['./list-tours.component.scss']
})
export class ListToursComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pagination = new MatPagination();
  displayedColumns = ['date', 'farm', 'create_by', 'area', 'duration', 'actions'];
  form!: FormGroup;

  constructor(
    private _expedientService: ExpedientsService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  get categories$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    const activeCostCenter = JSON.parse(localStorage.getItem('costCenter') || '{}');
    this.form = this.fb.group({
      farm: [activeCostCenter, [Validators.required]],
      since: ['', [Validators.required]],
      until: ['', [Validators.required]]
    });

    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  get mapData() {
    const val = this.form.value;
    return {
      farm_id: val.farm?.id,
      since: val.since ? format(new Date(val.since), 'yyyy-MM-dd') : null,
      until: val.until ? format(new Date(val.until), 'yyyy-MM-dd') : null
    };
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.pagination.listenPageChanges([this.paginator.page]);
    }
  }

  paginate(): void {
    this.pagination.perPage = 9;
    this.pagination.params = this.mapData;
    this._expedientService.list(this.pagination);
  }

  destroy(id: string | number): void {
    this._confirmation.dialogRemove().afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this._expedientService.delete(id).subscribe(() => {
          this._notificationMessage.success('Se eliminó correctamente');
          this.paginate();
        });
      }
    });
  }

  openDialog(id: string | number): void {
    this.dialog.open(ModalDetailToursComponent, {
      data: {
        farm: id
      },
      width: '90vw',
      height: '90vh',
      maxWidth: '1200px',
      maxHeight: '800px',
      panelClass: 'large-dialog'
    }).afterClosed().subscribe(() => {});
  }

  convertir(seconds: number): string {
    if (!seconds) return '0 segundos';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds / 60) % 60);
    const secs = Math.round(seconds % 60);
    return `${hrs} horas, ${mins} minutos y ${secs} segundos.`;
  }

  download(id: string | number): void {
    this._expedientService.download(id);
  }
}

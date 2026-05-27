import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErgonomicService } from '../../services/ergonomic.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { VulnerabilityPointWorkflowService } from '../../../vulnerability-point/services/vulnerability-point-workflow.service';

@Component({
  selector: 'app-list-tours',
  templateUrl: './list-tours.component.html',
  styleUrls: ['./list-tours.component.scss']
})
export class ListToursComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) private paginator!: MatPaginator;

  public pagination: MatPagination = new MatPagination();
  public displayedColumns: string[] = [
    'date',
    'farm',
    'create_by',
    'area',
    'duration',
    'actions'
  ];

  form: FormGroup;

  constructor(
    private _categoryService: ErgonomicService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _workflowService: VulnerabilityPointWorkflowService
  ) {}

  get isCaptureL2L3(): boolean {
    return this._workflowService.isCaptureL2L3();
  }

  get categories$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    const ccDefault = JSON.parse(localStorage.getItem('costCenter'));
    this.form = this.fb.group({
      farm: new FormControl(ccDefault, {
        validators: [Validators.required],
      }),
      since: new FormControl('', {
        validators: [Validators.required],
      }),
      until: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.pagination.perPage = 50;
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  get mapData() {
    const formValue = { ...this.form.value };
    return {
      farm_id: formValue.farm?.id,
      since: formValue.since ? formatDate(new Date(formValue.since), 'yyyy-MM-dd', 'en') : null,
      until: formValue.until ? formatDate(new Date(formValue.until), 'yyyy-MM-dd', 'en') : null,
    };
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  paginate(): void {
    this._categoryService.list(this.pagination);
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

  openDialog(id: any): void {
    // Abrir detalle del recorrido si se implementa un modal
    console.log('Ver detalle del recorrido:', id);
  }

  convertir(seconds: number): string {
    const secs = Math.round(seconds % 60).toString();
    const hours = Math.floor(seconds / 3600).toString();
    const mins = (Math.floor(seconds / 60) % 60).toString();
    return `${hours} horas, ${mins} minutos y ${secs} segundos.`;
  }

  download(id: number): void {
    this._categoryService.download(id);
  }
}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ExpedientsService } from '../../services/expedients.service';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { OfficeSelectService } from 'src/app/layouts/full/horizontal/office-select/office-select.service';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ModalQrGuardsComponent } from '../../components/modal-qr-guards/modal-qr-guards.component';

@Component({
  selector: 'app-list-expedients',
  templateUrl: './list-expedients.component.html',
  styleUrls: ['./list-expedients.component.scss']
})
export class ListExpedientsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pagination = new MatPagination();
  displayedColumns = [
    'code',
    'farm',
    'birth_certificate',
    'criminal_record',
    'curp',
    'ine',
    'license',
    'medical_exam',
    'proof_address',
    'proof_study',
    'references',
    'request_job',
    'socioeconomic_study',
    'actions'
  ];

  form!: FormGroup;

  documentColumns = [
    { key: 'criminal_record', label: 'Antecedentes Penales' },
    { key: 'curp', label: 'CURP' },
    { key: 'ine', label: 'INE' },
    { key: 'license', label: 'Licencia' },
    { key: 'medical_exam', label: 'Examen Médico' },
    { key: 'proof_address', label: 'Comprobante Domicilio' },
    { key: 'proof_study', label: 'Comprobante Estudios' },
    { key: 'references', label: 'Referencias' },
    { key: 'request_job', label: 'Solicitud Empleo' },
    { key: 'socioeconomic_study', label: 'Estudio Socioeconómico' }
  ];

  constructor(
    private _expedientService: ExpedientsService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _officeSelectService: OfficeSelectService
  ) {}

  ngOnInit(): void {
    const activeCostCenter = JSON.parse(localStorage.getItem('costCenter') || '{}');
    this.form = this.fb.group({
      farm: [activeCostCenter, [Validators.required]]
    });

    this.pagination.params = this.mapData;

    this.form.valueChanges.subscribe(() => {
      this.pagination.params = this.mapData;
    });

    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  get mapData() {
    return {
      farm_id: this.form.value.farm?.id
    };
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.pagination.listenPageChanges([this.paginator.page]);
    }
  }

  get collaborators$(): Observable<any[]> {
    return this.pagination.data$;
  }

  get isGlobal(): boolean {
    return this._officeSelectService.isGlobalSelected();
  }

  paginate(): void {
    this.pagination.perPage = 9;
    this.pagination.params = this.mapData;
    this._expedientService.listAreas(this.pagination);
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

  openDialog(element: any): void {
    this.dialog.open(ModalQrGuardsComponent, {
      data: {
        farm: element
      }
    });
  }

  downloadReport(id: string | number): void {
    this._expedientService.download(id);
  }
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErgonomicService } from '../../services/ergonomic.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalQrGuardsComponent } from '../../components/modal-qr-guards/modal-qr-guards.component';
import { OfficeSelectService } from 'src/app/layouts/full/horizontal/office-select/office-select.service';

@Component({
  selector: 'app-list-ergonomic',
  templateUrl: './list-ergonomic.component.html',
  styleUrls: ['./list-ergonomic.component.scss']
})
export class ListErgonomicComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @Input() idPatient: string;
  @Input() titulo: string;

  form: FormGroup;
  areaTypes: any[] = [];
  public pagination: MatPagination = new MatPagination();
  public displayedColumns: string[] = [
    'code',
    'farm',
    'is_controlled',
    'area_type',
    'actions'
  ];
  categories$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private _categoryService: ErgonomicService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private _officeSelectService: OfficeSelectService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.initializeForm();
  }

  initializeForm() {
    const ccDefault = JSON.parse(localStorage.getItem('costCenter') || '{}');
    this.form = this.fb.group({
      farm: new FormControl(ccDefault, { validators: [Validators.required] }),
      areaTypeId: new FormControl(null),
    });
    this.pagination.params = this.mapData;
  }

  ngOnInit(): void {
    this.hydrateFromQueryParams();
    this.loadAreaTypes();

    this.form.valueChanges.subscribe(() => {
      this.pagination.page = 1;
      this.pagination.params = this.mapData;
      this.updateQueryParams();
      this.loadData();
    });

    this.pagination.changeValues$.subscribe(() => {
      this.pagination.params = this.mapData;
      this.updateQueryParams();
      this.loadData();
    });

    this.pagination.params['patient_id'] = this.idPatient ? this.idPatient : '';
    this.pagination.next();
  }

  get mapData() {
    if (!this.form || !this.form.value) return { farm_id: null, area_type_id: null };
    const formValue = { ...this.form.value };
    const params: any = { farm_id: formValue.farm?.id };
    if (formValue.areaTypeId != null && formValue.areaTypeId !== '') {
      params['area_type_id'] = formValue.areaTypeId;
    }
    return params;
  }

  get isGlobal(): boolean {
    return this._officeSelectService.isGlobalSelected();
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  hydrateFromQueryParams() {
    const map = this._route.snapshot.queryParamMap;
    const page = map.get('page');
    const perPage = map.get('per_page');
    const search = map.get('search');
    const farmId = map.get('farm_id');
    const areaTypeId = map.get('area_type_id');

    if (page) this.pagination.page = Number(page);
    if (perPage) this.pagination.perPage = Number(perPage);
    if (search != null) this.pagination.search = search;
    if (farmId) this.form.patchValue({ farm: { id: Number(farmId) } }, { emitEvent: false });
    if (areaTypeId) this.form.patchValue({ areaTypeId: Number(areaTypeId) }, { emitEvent: false });

    this.pagination.params = this.mapData;
  }

  updateQueryParams() {
    const val = this.form?.value || {};
    const farmId = val.farm?.id ?? null;
    const areaTypeId = val.areaTypeId ?? null;

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        farm_id: farmId,
        area_type_id: areaTypeId,
        search: this.pagination.search || null,
        page: this.pagination.page,
        per_page: this.pagination.perPage
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  loadAreaTypes() {
    this._categoryService.areaTypes().subscribe({
      next: (response) => {
        const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
        this.areaTypes = data;
      },
      error: () => { this.areaTypes = []; }
    });
  }

  loadData() {
    this.pagination.params = this.mapData;
    this._categoryService.listAreas(this.pagination).subscribe({
      next: (r) => { this.categories$.next(r.data || []); },
      error: () => { this.categories$.next([]); }
    });
  }

  paginate(): void {
    this.pagination.perPage = 6;
    this.loadData();
  }

  destroy(id: string) {
    this._confirmation.dialogRemove().afterClosed().subscribe((result) => {
      if (result === 'confirmed') {
        this._categoryService.delete(id).subscribe(() => {
          this._notificationMessage.success('Se eliminó correctamente');
          this.loadData();
        });
      }
    });
  }

  openDialog(farm: any): void {
    this.dialog.open(ModalQrGuardsComponent, {
      data: { farm }
    }).afterClosed().subscribe(() => {});
  }
}

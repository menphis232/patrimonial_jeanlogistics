import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErgonomicService } from '../../services/ergonomic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-store-ergonomic',
  templateUrl: './store-ergonomic.component.html',
  styleUrls: ['./store-ergonomic.component.scss']
})
export class StoreErgonomicComponent implements OnInit, OnDestroy {

  form: FormGroup;
  public id: string | null = null;
  existingFiles: any[] = [];
  selectedAreaType: any = null;
  areaCategories: any[] = [];
  isSaving: boolean = false;
  private farmChangeSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _categoryService: ErgonomicService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute();
  }

  checkIdRoute() {
    this.activatedRoute.params.subscribe(param => {
      if (param['id']) {
        this.id = param['id'];
      }
    });
  }

  get mapData() {
    const formValue = { ...this.form.value };
    const files = formValue.files || [];
    const validFiles = Array.isArray(files) ? files.filter(f => f && (f.id || f.file_id)) : [];

    return {
      id: formValue.id,
      farm_id: formValue.farm?.id,
      code: formValue.code,
      name: formValue.name,
      description: formValue.description,
      area_meters: formValue.area_meters,
      persons: formValue.persons,
      activities: formValue.activities,
      is_controlled: formValue.is_controlled,
      dangerous_sustances: formValue.dangerous_sustances,
      work_schedule_id: formValue.work_schedule?.id,
      work_schedule_description: formValue.work_schedule_description,
      area_type_id: formValue.area_type?.id,
      area_category_id: formValue.area_category_id,
      files: validFiles.length > 0
        ? validFiles.map(f => ({ file_id: f.id || f.file_id, description: f.description || '' }))
        : null,
      shared_areas: Array.isArray(formValue.shared_areas) && formValue.shared_areas.length > 0
        ? formValue.shared_areas.filter((a: any) => a && a.id).map((a: any) => a.id)
        : []
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      farm: new FormControl(null, { validators: [Validators.required] }),
      code: new FormControl(null, { validators: [Validators.required] }),
      name: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [] }),
      area_meters: new FormControl(null, { validators: [] }),
      persons: new FormControl(null, { validators: [] }),
      activities: new FormControl(null, { validators: [] }),
      is_controlled: new FormControl(false, { validators: [] }),
      dangerous_sustances: new FormControl(false, { validators: [] }),
      work_schedule: new FormControl(null, { validators: [] }),
      work_schedule_description: new FormControl(null, { validators: [] }),
      area_type: new FormControl(null, { validators: [] }),
      area_category_id: new FormControl(null, { validators: [] }),
      files: [[]],
      shared_areas: new FormControl([], { validators: [] }),
    });

    this.checkEdit();

    this.farmChangeSub = this.form.get('farm')?.valueChanges.subscribe(() => {
      if (this.isVulnerabilityPointArea()) {
        this.loadAreaCategories();
      }
    });
  }

  ngOnDestroy(): void {
    this.farmChangeSub?.unsubscribe();
  }

  /**
   * Obtener contexto del farm para cargar categorías
   */
  getFarmContextForCategories(): { farmId: number | null, farmTypeId: number | null } {
    const farmVal = this.form.get('farm')?.value;
    let farmId: number | null = farmVal?.id != null ? Number(farmVal.id) : null;
    let farmTypeId: number | null = farmVal?.farm_type_id != null
      ? Number(farmVal.farm_type_id)
      : farmVal?.type_id != null
        ? Number(farmVal.type_id)
        : null;

    try {
      const ccStr = localStorage.getItem('costCenter');
      const cctStr = localStorage.getItem('costCenterType');
      if (ccStr) {
        const cc = JSON.parse(ccStr);
        if ((farmId == null || !Number.isFinite(farmId)) && cc?.id != null) farmId = Number(cc.id);
        if ((farmTypeId == null || !Number.isFinite(farmTypeId)) && cc?.farm_type_id != null) farmTypeId = Number(cc.farm_type_id);
      }
      if ((farmTypeId == null || !Number.isFinite(farmTypeId)) && cctStr) {
        const cct = JSON.parse(cctStr);
        if (cct?.id != null) farmTypeId = Number(cct.id);
      }
    } catch {}

    return {
      farmId: farmId != null && Number.isFinite(farmId) && farmId > 0 ? farmId : null,
      farmTypeId: farmTypeId != null && Number.isFinite(farmTypeId) && farmTypeId > 0 ? farmTypeId : null
    };
  }

  /**
   * Cargar categorías de área (solo para "Punto de vulnerabilidad")
   */
  loadAreaCategories() {
    if (!this.isVulnerabilityPointArea()) {
      this.areaCategories = [];
      return;
    }
    const { farmId, farmTypeId } = this.getFarmContextForCategories();
    if (!farmId && !farmTypeId) {
      this.areaCategories = [];
      return;
    }
    this._categoryService.getAreaCategories(farmId ?? undefined, farmTypeId ?? 0).subscribe({
      next: (res: any) => { this.areaCategories = Array.isArray(res) ? res : []; },
      error: (err: any) => { console.error('Error cargando categorías de área:', err); this.areaCategories = []; }
    });
  }

  checkEdit(): void {
    if (!this.id) return;
    this.getEditData(this.id);
  }

  getEditData(id: string): void {
    this._categoryService.showArea(id).subscribe((response: any) => {
      if (response.files) {
        this.existingFiles = Array.isArray(response.files) ? response.files : [response.files];
        this.existingFiles = this.existingFiles.map(f => ({
          id: f.id || f.file_id,
          name: f.name || f.original_name,
          url: f.url,
          file_id: f.id || f.file_id,
          description: f.description || ''
        }));
      }
      this.form.patchValue({ ...response, files: this.existingFiles });
      if (response.area_type) {
        this.onAreaTypeChange(response.area_type);
      }
    });
  }

  hasFiles(): boolean {
    const files = this.form.get('files')?.value;
    return Array.isArray(files) && files.length > 0 && files.some(f => f && (f.id || f.file_id));
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving) return;

    if (!this.hasFiles()) {
      this.form.patchValue({ files: null });
    }

    this.isSaving = true;
    this._categoryService.storeArea(this.mapData)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (response: IResponse) => {
          this._notificationMessage.success(response.message);
          this.router.navigate(['/ergonomic/list']);
        },
        error: () => {}
      });
  }

  onFilesChanged(event: any) {
    console.log('Files changed:', event);
    const currentFiles = this.form.get('files').value || [];
    const newFiles = event.addedFiles || [];
    this.form.patchValue({ files: [...currentFiles, ...newFiles] });
  }

  removeFile(fileToRemove: any) {
    console.log('Removing file:', fileToRemove);
    const updatedFiles = (this.form.get('files').value || []).filter((f: any) => {
      const fileId = f.id || f.file_id;
      const removeId = fileToRemove.id || fileToRemove.file_id;
      return fileId !== removeId;
    });
    this.form.patchValue({ files: updatedFiles });
  }

  isExistingFile(file: any): boolean {
    return file && (file.id || file.file_id) && file.url;
  }

  onAreaTypeChange(areaType: any): void {
    console.log('Tipo de área seleccionado:', areaType);
    this.selectedAreaType = areaType;

    if (this.isVulnerabilityPointArea()) {
      this.loadAreaCategories();
    } else {
      this.areaCategories = [];
      this.form.patchValue({ area_category_id: null });
    }

    if (this.isVulnerabilityArea()) {
      console.log('Es vulnerabilidad, mostrando todos los campos');
    } else {
      console.log('No es vulnerabilidad, limpiando campos');
      this.form.patchValue({
        description: null,
        area_meters: null,
        persons: null,
        activities: null,
        dangerous_sustances: false,
        shared_areas: [],
        work_schedule: null,
        work_schedule_description: null,
        files: []
      });
    }
  }

  isVulnerabilityArea(): boolean {
    const result = this.selectedAreaType && this.selectedAreaType.description === 'Vulnerabilidad';
    console.log('isVulnerabilityArea:', result, 'selectedAreaType:', this.selectedAreaType);
    return result;
  }

  isVulnerabilityPointArea(): boolean {
    return this.selectedAreaType && this.selectedAreaType.description === 'Punto de vulnerabilidad';
  }
}

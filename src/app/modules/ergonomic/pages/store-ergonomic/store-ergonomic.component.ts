import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ErgonomicService } from '../../services/ergonomic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-store-ergonomic',
  templateUrl: './store-ergonomic.component.html',
  styleUrls: ['./store-ergonomic.component.scss']
})
export class StoreErgonomicComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;
  existingFiles: any[] = [];
  selectedAreaType: any = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _categoryService: ErgonomicService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute()
  }

  checkIdRoute() {
    this.activatedRoute.params.subscribe(param => {

      if (!param['id'])
        return;

      this.id = param['id']
    })
  }

  get mapData() {
    const formValue = { ...this.form.value };
    
    // Validación específica para files
    const files = formValue.files || [];
    // Asegurarnos de que los archivos existentes y nuevos se manejen correctamente
    const validFiles = Array.isArray(files) ? files.filter(file => file && (file.id || file.file_id)) : [];

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
      files: validFiles.length > 0 ? validFiles.map(file => ({
        file_id: file.id || file.file_id,
        description: file.description || ''
      })) : null,
      shared_areas: Array.isArray(formValue.shared_areas) && formValue.shared_areas.length > 0
        ? formValue.shared_areas.filter(area => area && area.id).map(area => area.id)
        : []
    };
  }
  mapDiagnoses(diagnoses: any[]) {

    return diagnoses?.map(diagnoses => {
      return {
        human_body_system_id: diagnoses.human_body_system_id.id,
        description: diagnoses.description,
 
      }
    }) || []

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      farm: new FormControl(null, {
        validators: [Validators.required],
      }),

      code: new FormControl(null, {
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      description: new FormControl(null, {
        validators: [],
      }),
      area_meters: new FormControl(null, {
        validators: [],
      }),
      persons: new FormControl(null, {
        validators: [],
      }),
      activities: new FormControl(null, {
        validators: [],
      }),
      is_controlled: new FormControl(false, {
        validators: [],
      }),
      dangerous_sustances: new FormControl(false, {
        validators: [],
      }),
      work_schedule: new FormControl(null, {
        validators: [],
      }),
      work_schedule_description: new FormControl(null, {
        validators: [],
      }),
      area_type: new FormControl(null, {
        validators: [],
      }),
      files: [[]], // Inicializar como array vacío en lugar de null
      shared_areas: new FormControl([], {
        validators: [],
      }),
    });


    this.checkEdit();
  }

  /**
  * Modo edición del formulario
  * 
  * @param id ID
  */
  checkEdit(): void {

    if (!this.id)
      return;

    this.getEditData(this.id)
  }

  getEditData(id: string): void {
    this._categoryService.showArea(id).subscribe((response: any) => {
        // Manejar los archivos existentes
        if (response.files) {
            this.existingFiles = Array.isArray(response.files) ? response.files : [response.files];
            // Asegurarnos de que cada archivo tenga la estructura correcta
            this.existingFiles = this.existingFiles.map(file => ({
                id: file.id || file.file_id,
                name: file.name || file.original_name,
                url: file.url,
                file_id: file.id || file.file_id,
                description: file.description || ''
            }));
        }
        
        // Actualizar el formulario con los archivos existentes
        this.form.patchValue({
            ...response,
            files: this.existingFiles
        });
    });
  }

  // Método para verificar si hay archivos
  hasFiles(): boolean {
    const files = this.form.get('files')?.value;
    return Array.isArray(files) && files.length > 0 && files.some(file => file && (file.id || file.file_id));
  }

  save() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    // Validación adicional antes de enviar
    if (!this.hasFiles()) {
      this.form.patchValue({ files: null });
    }

    this._categoryService.storeArea(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/ergonomic/list"])
      });
  }

  // Actualizar el método para manejar archivos
  onFilesChanged(event: any) {
    console.log('Files changed:', event);
    const currentFiles = this.form.get('files').value || [];
    const newFiles = event.addedFiles || [];
    
    this.form.patchValue({
        files: [...currentFiles, ...newFiles]
    });
  }

  removeFile(fileToRemove: any) {
    console.log('Removing file:', fileToRemove);
    const currentFiles = this.form.get('files').value || [];
    const updatedFiles = currentFiles.filter(file => {
        // Comparar por id o file_id dependiendo de si es un archivo existente o nuevo
        const fileId = file.id || file.file_id;
        const removeId = fileToRemove.id || fileToRemove.file_id;
        return fileId !== removeId;
    });
    
    this.form.patchValue({
        files: updatedFiles
    });
  }

  // Método auxiliar para verificar si un archivo es existente
  isExistingFile(file: any): boolean {
    return file && (file.id || file.file_id) && file.url;
  }

  /**
   * Manejar cambio del tipo de área
   * 
   * @param areaType Tipo de área seleccionado
   */
  onAreaTypeChange(areaType: any): void {
    this.selectedAreaType = areaType;
  }

  /**
   * Verificar si el tipo de área es "Vulnerabilidad"
   * 
   * @returns boolean
   */
  isVulnerabilityArea(): boolean {
    return this.selectedAreaType && this.selectedAreaType.description === 'Vulnerabilidad';
  }
}


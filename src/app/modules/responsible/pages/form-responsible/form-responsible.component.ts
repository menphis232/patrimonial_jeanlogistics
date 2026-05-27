import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ResponsibleService } from '../../services/responsible.service';

@Component({
  selector: 'app-form-responsible',
  templateUrl: './form-responsible.component.html',
  styleUrls: ['./form-responsible.component.scss']
})
export class FormResponsibleComponent implements OnInit {
  responsibleForm: FormGroup;
  isEditMode: boolean = false;
  responsibleId: number;
  farms: any[] = [];
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _responsibleService: ResponsibleService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadFarms();
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.responsibleId = +params['id'];
        this.loadResponsible(this.responsibleId);
      }
    });
  }

  createForm(): void {
    this.responsibleForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      farm: [null, [Validators.required]]
    });
  }

  loadResponsible(id: number): void {
    this.isLoading = true;
    this._responsibleService.getById(id).subscribe(
      (response: any) => {
        console.log('Datos del responsable:', response);
        const data = response.data || response;
        this.responsibleForm.patchValue({
          name: data.name,
          email: data.email,
          phone: data.phone,
          farm: data.farm
        });
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al cargar el responsable:', error);
        this.isLoading = false;
        this.showMessage('Error al cargar los datos del responsable', 'error');
      }
    );
  }

  loadFarms(): void {
    this.http.get<any>('farms').subscribe(
      (response: any) => { this.farms = response.data || []; },
      (error: any) => { console.error('Error al cargar centros de trabajo:', error); }
    );
  }

  onSubmit(): void {
    if (this.responsibleForm.invalid) return;

    const formValue = this.responsibleForm.value;
    const payload = {
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      farm_id: formValue.farm && typeof formValue.farm === 'object' ? formValue.farm.id : formValue.farm
    };

    this.isLoading = true;

    if (this.isEditMode) {
      this._responsibleService.update(this.responsibleId, payload).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage('Responsable actualizado correctamente', 'success');
          this.router.navigate(['/responsible']);
        },
        (error: any) => {
          console.error('Error al actualizar el responsable:', error);
          this.isLoading = false;
          this.showMessage('Error al actualizar el responsable', 'error');
        }
      );
    } else {
      this._responsibleService.create(payload).subscribe(
        () => {
          this.isLoading = false;
          this.showMessage('Responsable creado correctamente', 'success');
          this.router.navigate(['/responsible']);
        },
        (error: any) => {
          console.error('Error al crear el responsable:', error);
          this.isLoading = false;
          this.showMessage('Error al crear el responsable', 'error');
        }
      );
    }
  }

  showMessage(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
    switch (type) {
      case 'success': this.toastr.success(message, 'Éxito'); break;
      case 'error':   this.toastr.error(message, 'Error'); break;
      case 'info':    this.toastr.info(message, 'Información'); break;
      case 'warning': this.toastr.warning(message, 'Advertencia'); break;
    }
  }

  cancel(): void {
    this.router.navigate(['/responsible']);
  }
}

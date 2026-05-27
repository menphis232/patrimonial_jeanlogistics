import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExpedientsService } from '../../services/expedients.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-expedients',
  templateUrl: './store-expedients.component.html',
  styleUrls: ['./store-expedients.component.scss']
})
export class StoreExpedientsComponent implements OnInit {
  form!: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _expedientService: ExpedientsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute();
  }

  checkIdRoute(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
      }
    });
  }

  get mapData() {
    const val = this.form.value;
    return {
      id: val.id,
      farm_id: val.farm?.id,
      gerency_id: val.gerency?.id,
      code_employee: val.code_employee,
      name_employee: val.name_employee,
      catch_at: val.catch_at ? format(new Date(val.catch_at), 'yyyy-MM-dd HH:mm') : null,
      request_job: val.request_job,
      request_job_files: val.files_request_job ? val.files_request_job.map((f: any) => f.id) : [],
      birth_certificate: val.birth_certificate,
      birth_certificate_files: val.files_birth_certificate ? val.files_birth_certificate.map((f: any) => f.id) : [],
      criminal_record: val.criminal_record,
      criminal_record_files: val.files_criminal_record ? val.files_criminal_record.map((f: any) => f.id) : [],
      socioeconomic_study: val.socioeconomic_study,
      socioeconomic_study_files: val.files_socioeconomic_study ? val.files_socioeconomic_study.map((f: any) => f.id) : [],
      proof_address: val.proof_address,
      proof_address_files: val.files_proof_address ? val.files_proof_address.map((f: any) => f.id) : [],
      proof_study: val.proof_study,
      proof_study_files: val.files_proof_study ? val.files_proof_study.map((f: any) => f.id) : [],
      references: val.references,
      references_files: val.files_references ? val.files_references.map((f: any) => f.id) : [],
      updating_data: val.updating_data,
      updating_data_files: val.files_updating_data ? val.files_updating_data.map((f: any) => f.id) : [],
      medical_exam: val.medical_exam,
      medical_exam_files: val.files_medical_exam ? val.files_medical_exam.map((f: any) => f.id) : [],
      curp: val.curp,
      curp_files: val.files_curp ? val.files_curp.map((f: any) => f.id) : [],
      license: val.license,
      license_files: val.files_license ? val.files_license.map((f: any) => f.id) : [],
      ine: val.ine,
      ine_files: val.files_ine ? val.files_ine.map((f: any) => f.id) : [],
      status_expedient: val.status_expedient,
      files: val.files ? val.files.map((f: any) => f.id) : []
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id],
      farm: [null, [Validators.required]],
      gerency: [null],
      code_employee: [null, [Validators.required]],
      name_employee: [null, [Validators.required]],
      catch_at: [null],
      request_job: [false],
      files_request_job: [null],
      birth_certificate: [false],
      files_birth_certificate: [null],
      criminal_record: [false],
      files_criminal_record: [null],
      socioeconomic_study: [false],
      files_socioeconomic_study: [null],
      proof_address: [false],
      files_proof_address: [null],
      proof_study: [false],
      files_proof_study: [null],
      references: [false],
      files_references: [null],
      updating_data: [false],
      files_updating_data: [null],
      medical_exam: [false],
      files_medical_exam: [null],
      curp: [false],
      files_curp: [null],
      license: [false],
      files_license: [null],
      ine: [false],
      files_ine: [null],
      status_expedient: ['C'],
      files: [null]
    });

    this.checkEdit();
  }

  checkEdit(): void {
    if (this.id) {
      this.getEditData(this.id);
    }
  }

  getEditData(id: string): void {
    this._expedientService.showArea(id).subscribe(data => {
      console.log('Datos recibidos del servidor:', data);
      const expedient = data?.data ?? data;
      if (expedient.catch_at) {
        expedient.catch_at = new Date(expedient.catch_at);
      }
      this.form.patchValue(expedient);
      console.log('Formulario después de patchValue:', this.form.value);
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    if (!this.form.invalid) {
      this._expedientService.storeArea(this.mapData).subscribe(res => {
        this._notificationMessage.success(res.message || 'Guardado correctamente');
        this.router.navigate(['/expedients/list']);
      });
    }
  }
}

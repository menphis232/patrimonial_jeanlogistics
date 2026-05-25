import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IncapacityService } from '../../services/incapacity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';
@Component({
  selector: 'app-validate-incapacity',
  templateUrl: './validate-incapacity.component.html',
  styleUrls: ['./validate-incapacity.component.scss'],
})
export class ValidateIncapacityComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _incapacityService: IncapacityService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute()
  }

  checkIdRoute() {
    this.activatedRoute.params.subscribe(param => {

      if (!param['medical_consultation_id'])
        return;

      this.id = param['medical_consultation_id']
    })
  }

  get mapData() {

    const formValue = { ...this.form.value };
    return {
      start: format(new Date(formValue.start), 'yyyy-MM-dd') ,
      end: format(new Date(formValue.end), 'yyyy-MM-dd') ,
      attended_at: format(new Date(formValue.attended_at), 'yyyy-MM-dd HH:mm'),
      medical_consultation_id: formValue.medical_consultation,
      incapacity_type_id: formValue.incapacity_type?.id,
      observations: formValue.observations,
      }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      medical_consultation: new FormControl(this.id, {}),
      start: new FormControl(null, {
        validators: [Validators.required],
      }),
      end: new FormControl(null, {
        validators: [Validators.required],
      }),
      incapacity_type: new FormControl(null, {
        validators: [Validators.required],
      }),
      observations: new FormControl(null, {
        validators: [],
      }),
      attended_at: new FormControl(null, {
        validators: [],
      })
    });


    // this.checkEdit();
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
    this._incapacityService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._incapacityService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/incapacity/list"])
      })
  }


}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OperationChangeService } from '../../services/operation-change.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-operation-change',
  templateUrl: './store-operation-change.component.html',
  styleUrls: ['./store-operation-change.component.scss'],
})
export class StoreOperationChangeComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _operationChangeService: OperationChangeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute()
  }

  checkIdRoute() {
    this.activatedRoute.params.subscribe(param => {

      if (!param['patient_id'])
        return;

      this.id = param['patient_id']
    })
  }

  get mapData() {

    const formValue = { ...this.form.value };
    return {

      patient_id: formValue.patient_id,
      cost_center_type_id: formValue.cost_center_type?.id,
      cost_center_id: formValue.cost_center?.id,
      medical_consultation_id: formValue.medical_consultation_id,
      start: format(new Date(formValue.start), 'yyyy-MM-dd') ,
      end: format(new Date(formValue.end), 'yyyy-MM-dd') ,
      operation_change_category_id:formValue.operation_change_category?.id,
      work_space_origin_id:formValue.work_space_origin?.id,
      work_space_destination_id:formValue.work_space_destination?.id,
      origin_cost_center_area_id:formValue.origin_cost_center_area?.id,
      destination_cost_center_area_id:formValue.destination_cost_center_area?.id,
      antiquity_in_operation:formValue.antiquity_in_operation,
      reason: formValue.reason,
      restrictions: formValue.restrictions,
      
      }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      patient_id: new FormControl(this.id, {}),
      medical_consultation_id:new FormControl(null, {}),
      start:new FormControl(null, {}),
      end:new FormControl(null, {}),
      operation_change_category: new FormControl(null, {
        validators: [],
      }),
      work_space_origin:new FormControl(null, {}),
      work_space_destination:new FormControl(null, {}),
      origin_cost_center_area:new FormControl(null, {}),
      destination_cost_center_area:new FormControl(null, {}),
      antiquity_in_operation:new FormControl(null, {}),
      reason: new FormControl(null, {
        validators: [],
      }),
      restrictions: new FormControl(null, {
        validators: [],
      }),
      cost_center_type: [null, Validators.required],
      cost_center: [null, Validators.required],
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
    this._operationChangeService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._operationChangeService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/operation-change/list"])
      })
  }


}


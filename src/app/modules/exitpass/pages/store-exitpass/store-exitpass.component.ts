import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ExitpassService } from '../../services/exitpass.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-exitpass',
  templateUrl: './store-exitpass.component.html',
  styleUrls: ['./store-exitpass.component.scss']
})
export class StoreExitpassComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _exitpassService: ExitpassService,
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

      medical_consultation_id: formValue.medical_consultation,
      exit_pass_reason_id: formValue.exit_pass_reason?.id,
      observations: formValue.observations,
      }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      medical_consultation: new FormControl(this.id, {}),
      exit_pass_reason: new FormControl(null, {
        validators: [Validators.required],
      }),
      observations: new FormControl(null, {
        validators: [],
      }),
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
    this._exitpassService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._exitpassService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/incapacity/list"])
      })
  }


}


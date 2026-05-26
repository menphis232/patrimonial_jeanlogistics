import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { MeasurementService } from '../../services/measurement.service';

@Component({
  selector: 'app-store-measurement',
  templateUrl: './store-measurement.component.html',
  styleUrls: ['./store-measurement.component.scss'],
})
export class StoreMeasurementComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _measurementService: MeasurementService,
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

    return formValue;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      name: new FormControl(null, {
        validators: [],
      }),
      description: new FormControl(null, {
        validators: [],
      })
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
    this._measurementService.show(id).subscribe((brandData: any) =>{ 
      this.form.patchValue(brandData)
       this.form.controls['name'].setValue(brandData.description)
    })
  }

  save() {
    
    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._measurementService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/measurement/list"])
      })
  }

}

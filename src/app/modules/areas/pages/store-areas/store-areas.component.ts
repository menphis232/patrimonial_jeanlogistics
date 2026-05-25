import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreasService } from '../../services/areas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { passwordMatch } from 'src/app/shared/rules/password-match';

@Component({
  selector: 'app-store-areas',
  templateUrl: './store-areas.component.html',
  styleUrls: ['./store-areas.component.scss'],
})
export class StoreAreasComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _areasService: AreasService,
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
    console.log(formValue);
    
    return {
      ...formValue,
      cost_center_id:formValue.cost_center.id,
      cost_center_type: formValue.cost_center_type.id,
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      code: new FormControl(null, {
        validators: [Validators.required],
      }),
      cost_center: new FormControl(null, {
        validators: [Validators.required],
      }),
      cost_center_type: new FormControl(null, {
        validators: [Validators.required],
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
    this._areasService.show(id).subscribe((areaData: any) => {
      this.form.patchValue(areaData)
      this.form.get('cost_center_type').setValue({
        id: 1,
        name: 'Plantas',
        code: 'foods',
      })
    })
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return
      
    this._areasService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/areas/list"])
      })
  }
}

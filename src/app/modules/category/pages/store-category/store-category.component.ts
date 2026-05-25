import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-store-category',
  templateUrl: './store-category.component.html',
  styleUrls: ['./store-category.component.scss'],
})
export class StoreCategoryComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _categoryService: CategoryService,
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

    return {
      id:formValue.id,
      turn_id:formValue.turn?.id,
      farm_id:formValue.farm?.id,
      code:formValue.code,
      first_name:formValue.first_name,
      last_name:formValue.last_name,
      type:'farm',
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      farm: new FormControl(null, {
        validators: [Validators.required],
      }),
      turn: new FormControl(null, {
        validators: [Validators.required],
      }),
      code: new FormControl(null, {
        validators: [Validators.required],
      }),
      first_name: new FormControl(null, {
        validators: [Validators.required],
      }),
      last_name: new FormControl(null, {
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
    this._categoryService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._categoryService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/category/list"])
      })
  }


}

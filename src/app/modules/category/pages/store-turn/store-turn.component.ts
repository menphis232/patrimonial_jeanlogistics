import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';

@Component({
  selector: 'app-store-turn',
  template: `
    <div class="row">
      <div class="col-lg-12">
        <mat-card class="cardWithShadow theme-card">
          <mat-card-content>
            <form [formGroup]="form" ngForm>
              <div class="row">
                <div class="col-sm-12 col-md-4">
                  <div class="mat-subtitle-2 f-w-600 d-block m-b-16">Nombre del turno</div>
                  <mat-form-field appearance="outline" class="w-100">
                    <input matInput formControlName="description" placeholder="" />
                    <mat-error *ngIf="form.controls['description'].invalid && form.controls['description'].touched">
                      El nombre del turno es obligatorio
                    </mat-error>
                  </mat-form-field>
                </div>
              </div>

              <div class="d-flex justify-content-end">
                <button mat-flat-button color="primary" type="button" (click)="save()">
                  <i-tabler name="device-floppy" class="icon-18 m-r-4"></i-tabler>
                  Guardar
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .w-100 { width: 100%; }
    .m-b-16 { margin-bottom: 16px; }
    .icon-18 { font-size: 18px; }
    .m-r-4 { margin-right: 4px; }
    .cardWithShadow { box-shadow: 0 2px 15px rgba(0,0,0,.05); }
  `]
})
export class StoreTurnComponent implements OnInit {
  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute();
  }

  checkIdRoute(): void {
    this.activatedRoute.params.subscribe((param) => {
      if (!param['id']) {
        return;
      }

      this.id = param['id'];
    });
  }

  get mapData() {
    const formValue = { ...this.form.value };

    return {
      id: formValue.id,
      description: formValue.description,
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
    });

    this.checkEdit();
  }

  checkEdit(): void {
    if (!this.id) {
      return;
    }

    this.getEditData(this.id);
  }

  getEditData(id: string): void {
    this._categoryService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData));
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this._categoryService.storeTurn(this.mapData).subscribe((response: IResponse) => {
      this._notificationMessage.success(response.message);
      this.router.navigate(['/category/list/turns']);
    });
  }
}

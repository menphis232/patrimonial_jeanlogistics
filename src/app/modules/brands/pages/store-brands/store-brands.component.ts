import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-store-brands',
  templateUrl: './store-brands.component.html',
  styleUrls: ['./store-brands.component.scss'],
})
export class StoreBrandsComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _brandsService: BrandsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.checkIdRoute()
  }

  checkIdRoute() {
    this.activatedRoute.params.subscribe(param => {
      if (!param['id']) return;
      this.id = param['id'];
    });
  }

  get mapData() {
    const formValue = { ...this.form.value };

    return {
      id: formValue.id,
      farm_id: formValue.farm?.id,
      status_camera_id: formValue.status_camera?.id,
      // access_id: formValue.access?.id,
      alarm: formValue.alarm,
      camera_internal: formValue.camera_internal,
      camera_peripheral: formValue.camera_peripheral,
      camera_false: formValue.camera_false,
      camera_access: formValue.camera_access,
      investment: formValue.investment,
      alarm_proposal: formValue.alarm_proposal,
      camera_internal_proposal: formValue.camera_internal_proposal,
      camera_peripheral_proposal: formValue.camera_peripheral_proposal,
      camera_false_proposal: formValue.camera_false_proposal,
      camera_access_proposal: formValue.camera_access_proposal,
      siege: formValue.siege,
      investment_proposal: formValue.investment_proposal,
      red_proposal: formValue.red_proposal,
      dvr_proposal: formValue.dvr_proposal,
      nube: formValue.nube,
      memory: formValue.memory,
      priority: formValue.priority,
      comments: formValue.comments,
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      farm: new FormControl(null, { validators: [Validators.required] }),
      status_camera: new FormControl(null, { validators: [Validators.required] }),
      // access: new FormControl(null, { validators: [Validators.required] }),
      alarm: new FormControl(null, { validators: [Validators.required] }),
      camera_internal: new FormControl(null, { validators: [Validators.required] }),
      camera_peripheral: new FormControl(null, { validators: [Validators.required] }),
      camera_false: new FormControl(null, { validators: [Validators.required] }),
      camera_access: new FormControl(null, { validators: [Validators.required] }),
      investment: new FormControl(null, { validators: [Validators.required] }),
      alarm_proposal: new FormControl(null, { validators: [Validators.required] }),
      camera_internal_proposal: new FormControl(null, { validators: [Validators.required] }),
      camera_peripheral_proposal: new FormControl(null, { validators: [Validators.required] }),
      camera_false_proposal: new FormControl(null, { validators: [Validators.required] }),
      camera_access_proposal: new FormControl(null, { validators: [Validators.required] }),
      siege: new FormControl(null, { validators: [Validators.required] }),
      investment_proposal: new FormControl(null, { validators: [Validators.required] }),
      red_proposal: new FormControl(null, { validators: [Validators.required] }),
      dvr_proposal: new FormControl(null, { validators: [Validators.required] }),
      nube: new FormControl(null, { validators: [Validators.required] }),
      memory: new FormControl(null, { validators: [Validators.required] }),
      priority: new FormControl(null, { validators: [Validators.required] }),
      comments: new FormControl(null, { validators: [Validators.required] }),
    });

    this.checkEdit();
  }

  /**
   * Modo edición del formulario
   * @param id ID
   */
  checkEdit(): void {
    if (!this.id) return;
    this.getEditData(this.id);
  }

  getEditData(id: string): void {
    this._brandsService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData));
  }

  save() {
    this.form.markAllAsTouched();
    // if (this.form.invalid) return;

    this._brandsService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/brands/list"]);
      });
  }
}

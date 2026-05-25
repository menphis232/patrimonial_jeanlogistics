import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ActivePrincipleService } from '../../services/active-principle.service';

@Component({
  selector: 'app-store-active-principle',
  templateUrl: './store-active-principle.component.html',
  styleUrls: ['./store-active-principle.component.scss'],
})
export class StoreActivePrincipleComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _activePrincipleService: ActivePrincipleService,
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
      id: [this.id],
      name: [null, Validators.required],
      description: [null],
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
    this._activePrincipleService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {
    
    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._activePrincipleService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/active-principle/list"])
      })
  }

}

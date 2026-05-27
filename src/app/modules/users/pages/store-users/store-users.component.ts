import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { passwordMatch } from 'src/app/shared/rules/password-match';

@Component({
  selector: 'app-store-users',
  templateUrl: './store-users.component.html',
  styleUrls: ['./store-users.component.scss'],
})
export class StoreUsersComponent implements OnInit {

  @ViewChild('cedisSelect') cedisSelect: any;

  form!: FormGroup;
  public id: string | null = null;
  private suppressFarmTypeCascade = false;

  excludedRoles = [
    'DDO',
    'U1',
    'web manager/administrador general',
    'seguridad industrial',
    'web manager'
  ];

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _usersService: UsersService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = id;
    }
    this.activatedRoute.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.id = paramId;
        this.form?.get('id')?.setValue(paramId);
      }
    });
  }

  get cedisQueryParams(): { param: string; value: string | null }[] {
    const ids = this.collectIds(this.form?.get('farm_types')?.value);
    if (ids.length === 0) return [];
    
    // Regresamos al parámetro original: farm_type_ids=3,2,1 (sin codificación de URL en las comas)
    // El CustomHttpParamEncoder se encargará de mantener las comas crudas.
    return [
      { param: 'farm_type_ids', value: ids.join(',') },
      { param: 'farm_type_id', value: null }
    ];
  }

  get cedisSelectLocked(): boolean {
    return this.collectIds(this.form?.get('farm_types')?.value).length === 0;
  }

  onFarmTypesUserChange(e: any): void {
    if (this.suppressFarmTypeCascade) return;
    this.cedisSelect?.resetCache?.();
    this.form.get('farms')?.setValue([]);
  }

  onFarmsChange(e: any): void {}

  get mapData(): any {
    const formValue = { ...this.form.value };
    const extractIds = (val: any): number[] => {
      if (val == null) return [];
      if (Array.isArray(val)) {
        return val
          .filter(p => p != null)
          .map(p => (typeof p === 'object' && p !== null && 'id' in p) ? Number(p.id) : Number(p))
          .filter(p => Number.isFinite(p));
      }
      if (typeof val === 'object' && val !== null && 'id' in val) {
        const n = Number(val.id);
        return Number.isFinite(n) ? [n] : [];
      }
      const n = Number(val);
      return Number.isFinite(n) ? [n] : [];
    };

    const mapped: any = {
      ...formValue,
      farms: extractIds(formValue.farms),
      username: formValue.name,
      roles: this.normalizeSingleRole(formValue.roles),
      farm_types: extractIds(formValue.farm_types),
    };

    if (this.id) {
      mapped.id = this.id;
    }

    if (!formValue.password || String(formValue.password).trim() === '') {
      delete mapped.password;
    }
    if (!formValue.password_confirm || String(formValue.password_confirm).trim() === '') {
      delete mapped.password_confirm;
    }

    return mapped;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      email: new FormControl(null, { validators: [] }),
      username: new FormControl(null, { validators: [] }),
      name: new FormControl(null, { validators: [Validators.required] }),
      farms: new FormControl([], { validators: [Validators.required] }),
      roles: new FormControl(null, { validators: [Validators.required] }),
      password: new FormControl(null, { validators: [Validators.minLength(6)] }),
      password_confirm: new FormControl(null, { validators: [passwordMatch('password')] }),
      farm_types: new FormControl([], { validators: [Validators.required] }),
    });

    this.checkEdit();
  }

  checkEdit(): void {
    if (this.id) {
      this.getEditData(this.id);
    }
  }

  getEditData(id: string): void {
    this._usersService.show(id).subscribe((userData: any) => {
      this.suppressFarmTypeCascade = true;

      if (this.form.get('signatures')) {
        this.form.get('signatures')?.setValue(null);
      }

      const { roles, ...rest } = userData;
      this.form.patchValue(rest);

      if (userData.roles && userData.roles.length > 0) {
        this.form.get('roles')?.setValue(userData.roles[0]);
      }
      if (userData.farms) {
        this.form.get('farms')?.setValue(userData.farms);
      }
      if (userData.farm_types) {
        this.form.get('farm_types')?.setValue(userData.farm_types);
      }
      if (userData.signatures && userData.signatures.length > 0 && this.form.get('signatures')) {
        this.form.get('signatures')?.setValue(userData.signatures);
      }

      queueMicrotask(() => {
        this.suppressFarmTypeCascade = false;
      });
    });
  }

  save(): void {
    this.form.markAllAsTouched();
    this._usersService.store(this.mapData).subscribe((response: any) => {
      this._notificationMessage.success(response.message);
      this.router.navigate(['/users/list']);
    });
  }

  normalizeSingleRole(val: any): number[] {
    if (val == null) return [];
    if (Array.isArray(val)) {
      if (val.length === 0) return [];
      return this.normalizeSingleRole(val[0]);
    }
    if (typeof val === 'object' && val !== null && 'id' in val) {
      const n = Number(val.id);
      return Number.isFinite(n) ? [n] : [];
    }
    const n = Number(val);
    return Number.isFinite(n) ? [n] : [];
  }

  collectIds(val: any): number[] {
    if (val == null) return [];
    if (Array.isArray(val)) {
      const result: number[] = [];
      for (const item of val) {
        if (item == null) continue;
        if (typeof item === 'object' && 'id' in item) {
          const n = Number(item.id);
          if (Number.isFinite(n)) result.push(n);
        } else {
          const n = Number(item);
          if (Number.isFinite(n)) result.push(n);
        }
      }
      return [...new Set(result)];
    }
    if (typeof val === 'object' && val !== null && 'id' in val) {
      const n = Number(val.id);
      return Number.isFinite(n) ? [n] : [];
    }
    const n = Number(val);
    return Number.isFinite(n) ? [n] : [];
  }
}

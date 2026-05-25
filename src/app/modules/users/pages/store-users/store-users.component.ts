import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { passwordMatch } from 'src/app/shared/rules/password-match';

@Component({
  selector: 'app-store-users',
  templateUrl: './store-users.component.html',
  styleUrls: ['./store-users.component.scss'],
})
export class StoreUsersComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _usersService: UsersService,
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
    // console.log(formValue);
    
    return {
      ...formValue,
      farms: [ formValue.farms.id ],
      username: formValue.name,
      roles: [ formValue.roles.id ],
      // signatures: formValue.signatures.map(signature => signature.id)
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl(this.id, {}),
      email: new FormControl(null, {
        validators: [Validators.required],
      }),
      username: new FormControl(null, {
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
    
      farms: new FormControl(new Array, {
        validators: [Validators.required],
      }),
      roles: new FormControl(new Array, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [ Validators.required, Validators.minLength(6) ],
      }),
      password_confirm: new FormControl(null, {
        validators: [ Validators.required, passwordMatch('password') ],
      }),
  
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
    this._usersService.show(id).subscribe((userData: any) => {
      this.form.patchValue(userData)
      this.form.get("roles").setValue(userData.roles[0])
      this.form.get("cost_centers").setValue(userData.cost_centers[0])

    })
  }

  save() {

    this.form.markAllAsTouched();

    // if (this.form.invalid)
    //   return
      
    this._usersService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/users/list"])
      })
  }
}

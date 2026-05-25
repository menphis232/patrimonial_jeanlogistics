import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-store-articles',
  templateUrl: './store-articles.component.html',
  styleUrls: ['./store-articles.component.scss'],
})
export class StoreArticlesComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _articlesService: ArticlesService,
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


  get activePrincipleControl() {
    return this.form.get("spares") as FormArray
  }

  get mapData() {

    const formValue = { ...this.form.value };

    return {
      ...formValue,
      article_category_id: formValue.article_category.id,
      measurement_unit_id: formValue.measurement_unit.id,
      article_brand_id: formValue.article_brand.id,
      active_principles: formValue.active_principles.map((activePrinciple) => activePrinciple.id)
    };
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id],
      name: [null, Validators.required],
      description: [null],
      code: [null, Validators.required],
      article_category: [null, Validators.required],
      article_brand: [null, Validators.required],
      measurement_unit: [null, Validators.required],
      active_principles: [new Array, Validators.required],
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
    this._articlesService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    console.log(this.form);
    
    if (this.form.invalid)
      return

    this._articlesService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/articles/list"])
      })
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-recipe',
  templateUrl: './store-recipe.component.html',
  styleUrls: ['./store-recipe.component.scss']
})
export class StoreRecipeComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _recipeService: RecipeService,
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
      prescription_articles: this.mapInjury(formValue.prescription_articles),
      observations: formValue.observations,

      
      }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      medical_consultation: new FormControl(this.id, {}),

      observations: new FormControl(null, {
        validators: [],
      }),
      prescription_articles: this.fb.array([]),
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
    this._recipeService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  /**FUNCTION INJURY */

  mapInjury(injury: any[]) {

    return injury?.map(injury => {
      return {
        stock_id: injury.stock_id.id,
        quantity: injury.quantity,
        description: injury.description,
 
      }
    }) || []

  }


  get injuryInForm(): FormArray {
    return this.form.get('prescription_articles') as FormArray;
  }
  
  removeInjuryByIndex(index) {
    this.injuryInForm.removeAt(index);
  }

  addInjury() {
    this.injuryInForm.push(
      this.fb.group({
        stock_id: [null],
        quantity: [null],
        description: [null],
      })
    );
  }

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._recipeService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/incapacity/list"])
      })
  }


}


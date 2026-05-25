import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { MovementsService } from '../../services/movements.service';
import { OfficeSelectService } from 'src/app/layouts/full/horizontal/office-select/office-select.service';

@Component({
  selector: 'app-store-movements',
  templateUrl: './store-movements.component.html',
  styleUrls: ['./store-movements.component.scss'],
})
export class StoreMovementsComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  get stockMovementDetails() {
    return this.form.get("stock_movement_details") as FormArray
  }

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _movementsService: MovementsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _officeSelectService: OfficeSelectService
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
    const costCenter     = this._officeSelectService.getOfficeStorage("costCenter")
    const costCenterType = this._officeSelectService.getOfficeStorage("costCenterType")
    
    return {
      cost_center_type_id: costCenterType.id,
      cost_center_id: costCenter.id,
      stock_movement_concept_id: formValue.stock_movement_concept.id,
      stock_movement_details: this.mapMovementsDetails(formValue.stock_movement_details)
    };
  }

  mapMovementsDetails(movementsDetails: any[]) {

    return movementsDetails?.map(movement => {
      return {
        stock_id: movement.stock_id.id,
        quantity: movement.quantity,
      }
    }) || []

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id],
      stock_movement_concept: [null],
      stock_movement_details: this.fb.array([], [Validators.required]),
    });

    this.checkEdit();
  }

  addMovementDetail(movement = null) {

    const group = this.fb.group({
      stock_id: [ null, Validators.required ],
      quantity: [movement?.quantity || '', Validators.required],
    })

    this.stockMovementDetails.push(group);
  }

  removeMovementDetail(index: number) {
    this.stockMovementDetails.removeAt(index);
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
    this._movementsService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  save() {

    this.form.markAllAsTouched();

    console.log(this.form);
    
    if (this.form.invalid)
      return

    this._movementsService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/movements/list"])
      })
  }

//   {
//     "stock_movement_concept_id": 2,
//     "cost_center_type_id": "1",
//     "cost_center_id": "1",
//     "stock_movement_details": [
//         {
//             "stock_id": 381,
//             "quantity": "3"
//         }
//     ]
// }

}

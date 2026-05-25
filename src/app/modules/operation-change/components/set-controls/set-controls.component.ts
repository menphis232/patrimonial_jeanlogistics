import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { OperationChangeService } from '../../services/operation-change.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-set-controls',
  templateUrl: './set-controls.component.html',
  styleUrls: ['./set-controls.component.scss']
})
export class SetControlsComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  public consultation: any | null = null;

  get operationChange() {
    return this.form.get("operation_change_controls") as FormArray
  }

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _operationChangeService: OperationChangeService,
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
      ...formValue,
      operation_change_controls: this.mapOperations(formValue.operation_change_controls)
    };
  }

  mapOperations(operations: any[]) {

    return operations?.map(movement => {
      return {
        programmed_at: format(new Date(movement.programmed_at), 'yyyy-MM-dd'),
        raw_programmed_at: format(new Date(movement.programmed_at), 'yyyy-MM-ddTHH:mm:ss.SSSXXX'),
        restrictions: movement.restrictions,
      }
    }) || []

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [this.id],
      operation_change_controls: this.fb.array([], [Validators.required]),
    });

    this.getConsultation(this.id);
  }


  getConsultation(id: string): void {
    this._operationChangeService.show(id).subscribe((consultation: any) => {
      console.log(consultation);
      
      this.consultation = consultation
      
      if(consultation.operation_change_controls.length > 0){
        for(const operation of consultation.operation_change_controls){
          this.addOperation(operation)
        }
      }
    })
  }

  addOperation(opertation = null) {

    const group = this.fb.group({
      programmed_at: [opertation?.programmed_at, Validators.required ],
      raw_programmed_at: [opertation?.raw_programmed_at || ''],
      restrictions: [opertation?.restrictions || ''],
    })

    this.operationChange.push(group);
  }

  removeOperation(index: number) {
    this.operationChange.removeAt(index);
  }

  save() {
    
    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    console.log(this.mapData);
      
    this._operationChangeService.setControls(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/operation-change/list"])
      })
  }

  //   {
//     "operation_change_controls": [
//         {
//             "programmed_at": "2024-03-30",
//             "raw_programmed_at": "2024-03-30T16:00:00.000Z",
//             "restrictions": null
//         },
//         {
//             "programmed_at": "2024-03-29",
//             "raw_programmed_at": "2024-03-29T16:00:00.000Z",
//             "restrictions": null
//         }
//     ]
// }

}
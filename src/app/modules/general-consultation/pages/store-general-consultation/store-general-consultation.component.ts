import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GeneralConsultationService } from '../../services/general-consultation.service';
import { Router,ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-general-consultation',
  templateUrl: './store-general-consultation.component.html',
  styleUrls: ['./store-general-consultation.component.scss']
})
export class StoreGeneralConsultationComponent implements OnInit {

  @Input() id: string | null = null;
  medicalEventForm: FormGroup;
  formBuilder: any;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _generalConsultationService: GeneralConsultationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { 

  

    this.medicalEventForm = this.fb.group({
      parent_id: [null],
      patient: [null, Validators.required],
      cost_center_type: [null, Validators.required],
      patient_cost_center_area_id: [null, Validators.required],
      reason_consultation_id: [null, Validators.required],
      type_care_medical_id: [null, Validators.required],
      work_space: [null, Validators.required],
      patient_age: [null, Validators.required],
      patient_manager: [null, Validators.required],
      observations: [null],
      inmediate_boss: [null, Validators.required],
      treatment: [null, Validators.required],
      attended_at: [null, Validators.required],
      systolic_blood_pressure: [null, Validators.required],
      diastolic_blood_pressure: [null, Validators.required],
      diagnoses: this.fb.array([]),
      cost_center_id:[null]
  
    });
    }
  

  get mapData() {

    const formValue = { ...this.medicalEventForm.value };
   

    return {
    

      id: formValue.id,
      parent_id: formValue.parent_id,
      patient_id: formValue.patient?.id,
      cost_center_type_id: formValue.cost_center_type?.id,
      patient_cost_center_area_id: formValue.patient_cost_center_area_id?.id,
      reason_consultation_id: formValue.reason_consultation_id?.id,
      type_care_medical_id: formValue.reason_consultation_id?.id,
      work_space: formValue.work_space,
      patient_age: formValue.patient_age,
      patient_manager: formValue.patient_manager,
      observations: formValue.observations,
      inmediate_boss: formValue.inmediate_boss,
      treatment: formValue.treatment,
      attended_at: format(new Date(formValue.attended_at), 'yyyy-MM-dd'),
      systolic_blood_pressure: formValue.systolic_blood_pressure,
      diastolic_blood_pressure: formValue.diastolic_blood_pressure,
      diagnoses: this.mapDiagnoses(formValue.diagnoses),
      cost_center_id:formValue.cost_center_id?.id,
    }

  }

  mapDiagnoses(diagnoses: any[]) {

    return diagnoses?.map(diagnoses => {
      return {
        human_body_system_id: diagnoses.human_body_system_id.id,
        description: diagnoses.description,
 
      }
    }) || []

  }

  ngOnInit(): void {
    

    this.checkEdit();
  }

  /**
  * Modo edición del formulario
  * 
  * @param id ID
  */
  checkEdit(): void {

    

    this.getEditData(this.id)
  }

  getEditData(id: string): void {


    this.activatedRoute.params.subscribe(param => {

      if(param?.['id']){

        this._generalConsultationService.show(param?.['id']).subscribe((response: any) => {
      
          this.fillForm(response)
          
        })

      }
    })
  
  }

  save() {

    this.medicalEventForm.markAllAsTouched();

    // if (this.medicalEventForm.invalid)
    //   return
     
    this._generalConsultationService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/general-consultation"])
      })
  }

  /**FUNCTION DIAGNOSES */


  get diagnosesForm(): FormArray {
    return this.medicalEventForm.get('diagnoses') as FormArray;
  }
  
  removeInjuryByIndex(index) {
    this.diagnosesForm.removeAt(index);
  }

  addInjury(equipamentData = null) {

    console.log('equipo',equipamentData)
    this.diagnosesForm.push(
      this.fb.group({
        human_body_system_id: [null],
        description: [null],
      })
    );


  }

   
 

    /**
   * Llenar el formulario
   * 
   * @param data Data
   */
    fillForm(data){

    
      Object.keys(data).forEach((key) => {
        switch (key) {
    
          default:
            if (this.medicalEventForm.get(key)) {
              this.medicalEventForm.controls[key].setValue(data[key]);
            }
          break;
    
          case 'diagnoses':
          data.diagnoses.forEach((c) => {
            // console.log(c);
            this.diagnosesForm.push(
              this.fb.group({
                id: [c.id],
                human_body_system_id: [c.human_body_system_id, Validators.required],
                description: [c.description],
              })
            );
          });
          break;

       

        

        }
  
     });
    }

  

}



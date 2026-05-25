import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IncidentService } from '../../services/incident.service';
import { Router,ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-incident',
  templateUrl: './store-incident.component.html',
  styleUrls: ['./store-incident.component.scss']
})
export class StoreIncidentComponent implements OnInit {

  @Input() id: string | null = null;
  medicalEventForm: FormGroup;
  formBuilder: any;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _incidentService: IncidentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.medicalEventForm = this.fb.group({
      id: [null],
      parent_id: [null],
      patient: [null, Validators.required],
      cost_center_type: [null, Validators.required],
      cost_center: [null, Validators.required],
      patient_cost_center: [null, Validators.required],
      patient_cost_center_area: [null, Validators.required],
      turn: [null, Validators.required],
      supervisor_name: [null, Validators.required],
      work_department: [null, Validators.required],
      work_space: [null, Validators.required],
      seniority_company: [null, Validators.required],
      seniority_department: [null, Validators.required],
      observations: [null],
      immediate_boss: [null, Validators.required],
      immediate_boss_department: [null, Validators.required],
      diagnosis: [null, Validators.required],
      treatment: [null, Validators.required],
      address: [null, Validators.required],
      phone: [null, Validators.required],
      medical_event: this.fb.group({
        
        event_cost_center_area: [null, Validators.required],
        type_id: [64, Validators.required],
        suspension_at: [null, Validators.required],
        event_report_at: [null, Validators.required],
        reported_to_name: [null, Validators.required],
        reported_to_position: [null, Validators.required],
        activity_being_performed: [null, Validators.required],
        last_day_rest: [null, Validators.required],
        extra_time: [null, Validators.required],
        activities_outside_work: [null, Validators.required],
        regular_job: [null, Validators.required],
        regular_job_detail: [null],
        personal_protection_equipment: [null, Validators.required],
        personal_protection_equipment_detail: [null],
        place_event_occurred: [null, Validators.required],
        risk: [null, Validators.required],
        risk_description: [null],
        care_place: [null, Validators.required],
        medical_care_description: [null, Validators.required],
        time_type: [null, Validators.required],
        used_material: [null],
        approximate_cost: [null, Validators.required],
        event_evaluation: [null, Validators.required],
        risk_classification: [null, Validators.required],
        cause_effect_relationship: [null, Validators.required],
        event_description_at: [null, Validators.required],
        severe_traumatic_event: [null, Validators.required],
        incapacity_required: [null, Validators.required],
        incapacity_days: [null, Validators.required],
        cause: [null, Validators.required],
        event_at: [null, Validators.required],
        event_description: [null, Validators.required],
        injury_types: this.fb.array([]),
        affected_parts: this.fb.array([]),
        medical_event_witnesses: this.fb.array([]),
     
      }),
      files: []
    });
    }
  

  get mapData() {

    const formValue = { ...this.medicalEventForm.value };
   

    return {
      id: formValue.id,

      parent_id: null,
      patient_id:formValue.patient?.id ,
      cost_center_type_id: formValue.cost_center_type?.id,
      cost_center_id: formValue.cost_center?.id,
      patient_cost_center_id: formValue.patient_cost_center?.id ,
      patient_cost_center_area_id: formValue.patient_cost_center_area?.id ,
      turn_id: formValue.turn?.id ,
      supervisor_name: formValue.supervisor_name,
      work_department: formValue.work_department,
      work_space: formValue.work_space,
      seniority_company: formValue.seniority_company,
      seniority_department: formValue.seniority_department,
      observations: formValue.observations,
      immediate_boss: formValue.immediate_boss,
      immediate_boss_department: formValue.immediate_boss_department,
      diagnosis: formValue.diagnosis,
      treatment: formValue.treatment,
      address: formValue.address,
      phone: formValue.phone,
      medical_event: {
        
        event_cost_center_area_id: formValue.medical_event.event_cost_center_area?.id ,
        type_id: 64,
        suspension_at: format(new Date(formValue.medical_event.suspension_at), 'yyyy-MM-dd HH:mm:ss') ,
        event_report_at: format(new Date(formValue.medical_event.event_report_at), 'yyyy-MM-dd HH:mm:ss'),
        reported_to_name: formValue.medical_event.reported_to_name ,
        reported_to_position: formValue.medical_event.reported_to_position ,
        activity_being_performed: formValue.medical_event.activity_being_performed ,
        last_day_rest: format(new Date(formValue.medical_event.last_day_rest), 'yyyy-MM-dd') ,
        extra_time: formValue.medical_event.extra_time ,
        activities_outside_work: formValue.medical_event.activities_outside_work ,
        regular_job: formValue.medical_event.regular_job ,
        regular_job_detail: formValue.medical_event.regular_job_detail ,
        personal_protection_equipment: formValue.medical_event.personal_protection_equipment ,
        personal_protection_equipment_detail: formValue.medical_event.personal_protection_equipment_detail ,
        place_event_occurred: formValue.medical_event.place_event_occurred ,
        risk_id: formValue.medical_event.risk?.id,
        risk_description: formValue.medical_event.risk_description,
        care_place_id: formValue.medical_event.care_place?.id,
        medical_care_description: formValue.medical_event.medical_care_description,
        time_type_id: formValue.medical_event.time_type?.id,
        used_material: formValue.medical_event.used_material,
        approximate_cost: formValue.medical_event.approximate_cost,
        event_evaluation_id: formValue.medical_event.event_evaluation?.id,
        risk_classification_id: formValue.medical_event.risk_classification?.id,
        cause_effect_relationship: formValue.medical_event.cause_effect_relationship,
        event_description_at: format(new Date(formValue.medical_event.event_description_at), 'yyyy-MM-dd HH:mm:ss'),
        severe_traumatic_event: formValue.medical_event.severe_traumatic_event,
        incapacity_required: formValue.medical_event.incapacity_required,
        incapacity_days: formValue.medical_event.incapacity_days ? formValue.medical_event.incapacity_days : 0,
        cause_id: formValue.medical_event.cause?.id,
        event_at: format(new Date(formValue.medical_event.event_description_at), 'yyyy-MM-dd HH:mm'),
        event_description: formValue.medical_event.event_description,
        injury_types: this.mapInjury(formValue.medical_event.injury_types),
        affected_parts: this.mapAffected(formValue.medical_event.affected_parts),
        medical_event_witnesses: formValue.medical_event.medical_event_witnesses,
        },
        files: formValue.files.map(files => files.id)
      
    }

  }

  ngOnInit(): void {
    

    this.checkEdit();
  }


  mapInjury(injury: any[]) {

    return injury?.map(injury => {
      return {
        injury_type_id: injury.injury_type_id.id,
        description: injury.description,
 
      }
    }) || []

  }
  mapAffected(affected: any[]) {

    return affected?.map(affected => {
      return {
        body_part_detail_id: affected.body_part_detail_id.id,
        description: affected.description,
 
      }
    }) || []

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

        this._incidentService.show(param?.['id']).subscribe((response: any) => {

          console.log('este es el response de a consulta',response)
      
          this.fillForm(response)
          
        })

      }
    })
  
  }

  save() {

    // this.medicalEventForm.markAllAsTouched();

    // if (this.medicalEventForm.invalid)
    //   return

    this._incidentService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/incident"])
      })
  }

  /**FUNCTION INJURY */


  get injuryInForm(): FormArray {
    return this.medicalEventForm.get('medical_event.injury_types') as FormArray;
  }
  
  removeInjuryByIndex(index) {
    this.injuryInForm.removeAt(index);
  }

  addInjury() {
    this.injuryInForm.push(
      this.fb.group({
        injury_type_id: [null],
        description: [null],
      })
    );
  }

   /**FUNCTION AFFECT PARTS */


   get affectPartsInForm(): FormArray {
    return this.medicalEventForm.get('medical_event.affected_parts') as FormArray;
  }

  removeAffectPartsByIndex(index) {
    this.affectPartsInForm.removeAt(index);
  }

  addAffectParts() {
    this.affectPartsInForm.push(
      this.fb.group({
        body_part_detail_id: [null],
        description: [null],
      })
  
    );
  }


     /**FUNCTION AFFECT witnesses */


     get witenessesInForm(): FormArray {
      return this.medicalEventForm.get('medical_event.medical_event_witnesses') as FormArray;
    }
  
    removeWitenessesByIndex(index) {
      this.witenessesInForm.removeAt(index);
    }
  
    addWitenesses() {
      this.witenessesInForm.push(
        this.fb.group({
          name: [null],
          description: [null],
          description_at: [null],
        })
    
      );
    }

  setForm(e:any){
 
    this.medicalEventForm.controls['exam'].setValue(e)
  }

    /**
   * Llenar el formulario
   * 
   * @param data Data
   */
    fillForm(data){

    
      Object.keys(data).forEach((key) => {
        console.log('estas son las key',key )
                 
        switch (key) {
    

          default:
            if (this.medicalEventForm.get(key) && key !='medical_event') {
              this.medicalEventForm.controls[key].setValue(data[key]);
            }
          break;

          case 'cost_center_type_id':
          // const m =  format(new Date(data.birthdate), 'yyyy-MM-dd');
          this.medicalEventForm.controls['cost_center_type'].setValue({
            id: 1,
            name: 'Plantas',
            code: 'foods',
          })

          break;
         
       
   
          // case 'injury_types':
          // data.injury_types.forEach((c) => {
          //   // console.log(c);
          //   this.injuryInForm.push(
          //     this.fb.group({
          //       id: [c.id],
          //       injury_type_id: [c.injury_type_id, Validators.required],
          //       description: [c.description],
          //     })
          //   );
          // });
          // break;

          // case 'medical_event_witnesses':
          //   data.medical_event_witnesses.forEach((c) => {
          //     // console.log(c);
          //     this.witenessesInForm.push(
          //       this.fb.group({
          //         id: [c.id],
          //         name: [c.name, Validators.required],
          //         description: [c.description],
          //       })
          //     );
          //   });
          //   break;

          
          
      
        }
  
     });
      Object.keys(data.medical_event).forEach((key2) => {
                  switch (key2) {

                      default:
                        if (this.medicalEventForm.get('medical_event.'+key2) ) {
            console.log('llaves 2','medical_event.'+key2)
                          this.medicalEventForm.get('medical_event.'+key2).setValue(data.medical_event[key2]);
                        }
                      break;

                        case 'affected_parts':
                          data.medical_event.affected_parts.forEach((c) => {
                            console.log(c);
                            this.affectPartsInForm.push(
                              this.fb.group({
                                id: [c.id],
                                body_part_detail_id: [c, Validators.required],
                                description: [''],
                              })
                            );
                          });
                          break;

                          case 'suspension_at':

                          const m =  format(new Date(data.medical_event.suspension_at), 'yyyy-MM-dd');
                          this.medicalEventForm.get('medical_event.suspension_at').setValue(m)

                          break;

                          case 'event_report_at':

                          const m2 =  format(new Date(data.medical_event.event_report_at), 'yyyy-MM-dd');
                          this.medicalEventForm.get('medical_event.event_report_at').setValue(m2)

                          break;
                          case 'event_description_at':

                          const m3 =  format(new Date(data.medical_event.event_description_at), 'yyyy-MM-dd');
                          this.medicalEventForm.get('medical_event.event_description_at').setValue(m3)

                          break;

                          case 'event_cost_center_area_id':
                            // const m =  format(new Date(data.birthdate), 'yyyy-MM-dd');
                            this.medicalEventForm.get('medical_event.event_cost_center_area').setValue(data.medical_event['cost_center_area'])
                  
                            break;

                           case 'injury_types':
                          data.medical_event.injury_types.forEach((c) => {
                            console.log(c);
                            this.injuryInForm.push(
                              this.fb.group({
                                id: [c.id],
                                injury_type_id: [c, Validators.required],
                                description: [''],
                            
                              })
                            );
                          });
                          break;

                          case 'medical_event_witnesses':
                            data.medical_event.medical_event_witnesses.forEach((c) => {
                              // console.log(c);
                              this.witenessesInForm.push(
                                this.fb.group({
                                  id: [c.id],
                                  name: [c.name, Validators.required],
                                  description: [c.description],
                                })
                              );
                            });
                            break;

                  }
              })
    }

  

}


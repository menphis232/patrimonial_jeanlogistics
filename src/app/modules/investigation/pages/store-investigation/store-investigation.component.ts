import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { InvestigationService } from '../../services/investigation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-investigation',
  templateUrl: './store-investigation.component.html',
  styleUrls: ['./store-investigation.component.scss']
})
export class StoreInvestigationComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _investigationService: InvestigationService,
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
      damage_to_property: formValue.damage_to_property,
      inspection: formValue.inspection,
      description: formValue.object,
      instant_boss_version: formValue.instant_boss_version,
      instant_boss_version_at: format(new Date(formValue.instant_boss_version_at), 'yyyy-MM-dd HH:mm:ss'),
      severe_traumatic_event: formValue.severe_traumatic_event,
      iperc_risk_identified: formValue.iperc_risk_identified,
      iperc_control_measures: formValue.iperc_control_measures,
      iperc_control_measures_execute: formValue.iperc_control_measures_execute,
      iperc_update_required: formValue.iperc_update_required,
      has_evidence_job_induction: formValue.has_evidence_job_induction,
      has_evidence_safety_gear_used: formValue.has_evidence_safety_gear_used,
      has_evidence_risk_controls: formValue.has_evidence_risk_controls,
      has_evidence_security_procedures: formValue.has_evidence_security_procedures,
      observations: formValue.observations,     
      immediate_causes: this.mapCauses(formValue.immediate_causes),
      basic_causes: this.mapBasicCauses(formValue.basic_causes),
      root_cause_description: formValue.root_cause_description,  
      tool_used: formValue.tool_used, 
      participants: formValue.participants,
      actions: this.mapActions(formValue.actions),
      witnesses:formValue.witnesses,
      files: formValue.files.map(files => files.id)
      }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      medical_consultation: new FormControl(this.id, {}),
      damage_to_property:new FormControl(false, {}),
      inspection:new FormControl(null, {}),
      description:new FormControl(null, {}),
      instant_boss_version:new FormControl(null, {}),
      instant_boss_version_at:new FormControl(null, {}),
      severe_traumatic_event:new FormControl(null, {}),
      iperc_risk_identified:new FormControl(null, {}),
      iperc_control_measures:new FormControl(null, {}),
      iperc_control_measures_execute:new FormControl(null, {}),
      iperc_update_required:new FormControl(null, {}),
      has_evidence_job_induction:new FormControl(null, {}),
      has_evidence_safety_gear_used:new FormControl(null, {}),
      has_evidence_risk_controls:new FormControl(null, {}),
      has_evidence_security_procedures:new FormControl(null, {}),
      observations:new FormControl(null, {}),  
      immediate_causes: this.fb.array([]),
      basic_causes: this.fb.array([]),
      root_cause_description:new FormControl(null, {}),  
      tool_used:new FormControl(null, {}),  
      participants: this.fb.array([]),
      actions: this.fb.array([]),
      witnesses: this.fb.array([]),
      files: []

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
    this._investigationService.show(id).subscribe((brandData: any) => this.form.patchValue(brandData))
  }

  mapCauses(injury: any[]) {

    return injury?.map(injury => {
      return {
        immediate_cause_id: injury.immediate_cause_id.id,
        description: injury.description,
 
       
 
      }
    }) || []

  }

  mapBasicCauses(injury: any[]) {

    return injury?.map(injury => {
      return {
        basic_cause_id: injury.basic_cause_id.id,
        description: injury.description,
 
       
 
      }
    }) || []

  }

  mapActions(injury: any[]) {

    return injury?.map(injury => {
      return {
        employee_id: injury.employee_id.id,
        description: injury.description,
        responsible: injury.responsible,
        email: injury.email,
 
       
 
      }
    }) || []

  }

   /**FUNCTION CAUSES */


   get injuryInForm(): FormArray {
    return this.form.get('immediate_causes') as FormArray;
  }
  
  removeInjuryByIndex(index) {
    this.injuryInForm.removeAt(index);
  }

  addInjury() {
    this.injuryInForm.push(
      this.fb.group({
        immediate_cause_id: [null],
        description: [null],

      })
    );
  }

     /**FUNCTION BASIC CAUSES */


     get basicCauseForm(): FormArray {
      return this.form.get('basic_causes') as FormArray;
    }
    
    removeBasicCausesByIndex(index) {
      this.basicCauseForm.removeAt(index);
    }
  
    addBasicCauses() {
      this.basicCauseForm.push(
        this.fb.group({
          basic_cause_id: [null],
          description: [null],
  
        })
      );
    }

  /**FUNCTION AFFECT PARTICIPANT */


  get participantsForm(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  removeParticipantsByIndex(index) {
    this.participantsForm.removeAt(index);
  }

  addParticipants() {
    this.participantsForm.push(
      this.fb.group({
        name: [null],
        work_job: [null],
        department: [null],
      })
  
    );
  }

    /**FUNCTION  ACTIONS */



    get actionsForm(): FormArray {
      return this.form.get('actions') as FormArray;
    }
  
    removeActionsByIndex(index) {
      this.actionsForm.removeAt(index);
    }
  
    addActions() {
      this.actionsForm.push(
        this.fb.group({
          employee_id: [null],
          description: [null],
          responsible: [null],
          email: [null],
        })
    
      );
    }
 /**FUNCTION AFFECT witnesses */


 get witenessesInForm(): FormArray {
  return this.form.get('witnesses') as FormArray;
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

  save() {

    this.form.markAllAsTouched();

    if (this.form.invalid)
      return

    this._investigationService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/accident/list"])
      })
  }


}



import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IncidentService } from '../../services/incident.service';
import { EmployeeService } from 'src/app/modules/employee/services/employee.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-store-incident',
  templateUrl: './store-incident.component.html',
  styleUrls: ['./store-incident.component.scss']
})
export class StoreIncidentComponent implements OnInit {
  @Input() id: string | null = null;
  medicalEventForm: FormGroup;
  idPatient: any = "";

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _incidentService: IncidentService,
    private router: Router,
    private _employeeService: EmployeeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.medicalEventForm = this.fb.group({
      id: [null],
      parent_id: [null],
      patient: [null],
      cost_center_type: [null],
      cost_center: [null],
      patient_cost_center: [null],
      patient_cost_center_area: [null],
      turn: [null],
      supervisor_name: [null],
      work_department: [null],
      work_space: [null],
      seniority_company: [null],
      seniority_department: [null],
      observations: [null],
      immediate_boss: [null],
      immediate_boss_department: [null],
      diagnoses: this.fb.array([]),
      treatment: [null],
      address: [null],
      phone: [null],
      type_care_medical_id: [null],
      medical_event: this.fb.group({
        event_cost_center_area: [null],
        type_id: [64],
        suspension_at: [null],
        event_report_at: [null],
        reported_to_name: [null],
        reported_to_position: [null],
        activity_being_performed: [null],
        last_day_rest: [null],
        extra_time: [null],
        activities_outside_work: [null],
        regular_job: [null],
        regular_job_detail: [null],
        personal_protection_equipment: [null],
        personal_protection_equipment_detail: [null],
        place_event_occurred: [null],
        risk: [null],
        risk_description: [null],
        care_place: [null],
        medical_care_description: [null],
        time_type: [null],
        used_material: [null],
        approximate_cost: [null],
        event_evaluation: [null],
        risk_classification: [null],
        cause_effect_relationship: [null],
        event_description_at: [null],
        severe_traumatic_event: [null],
        incapacity_required: [null],
        incapacity_days: [null],
        cause: [null],
        event_at: [null],
        event_description: [null],
        injury_types: this.fb.array([]),
        affected_parts: this.fb.array([]),
        medical_event_witnesses: this.fb.array([])
      }),
      files: [],
      files_comment: [""],
      codigo: [""]
    });

    this.activatedRoute.params.subscribe(param => {
      if (param?.['idPatient']) {
        this._employeeService.show2(param['idPatient']).subscribe((emp: any) => {
          this.medicalEventForm.controls['patient'].setValue(emp);
          this.selectPatient();
        });
      }
    });
  }

  get mapData() {
    const e = { ...this.medicalEventForm.value };
    const costCenterType = JSON.parse(localStorage.getItem("costCenterType") || "{}");
    const costCenter = JSON.parse(localStorage.getItem("costCenter") || "{}");

    return {
      id: e.id,
      parent_id: null,
      patient_id: e.patient?.id,
      cost_center_type_id: costCenterType.id,
      cost_center_id: costCenter.id,
      patient_cost_center_id: e.patient_cost_center?.id,
      patient_cost_center_area_id: e.patient_cost_center_area?.id,
      turn_id: e.turn?.id,
      type_care_medical_id: e.type_care_medical_id?.id,
      supervisor_name: e.supervisor_name,
      work_department: e.work_department,
      work_space_id: e.work_space?.id,
      seniority_company: e.seniority_company,
      seniority_department: e.seniority_department,
      observations: e.observations,
      immediate_boss: e.immediate_boss,
      immediate_boss_department: e.immediate_boss_department,
      diagnoses: this.mapDiagnoses(e.diagnoses),
      treatment: e.treatment,
      address: e.address,
      phone: e.phone,
      medical_event: {
        event_cost_center_area_id: e.medical_event.event_cost_center_area?.id,
        type_id: 64,
        suspension_at: e.medical_event.suspension_at ? format(new Date(e.medical_event.suspension_at), "yyyy-MM-dd HH:mm:ss") : null,
        event_report_at: e.medical_event.event_report_at ? format(new Date(e.medical_event.event_report_at), "yyyy-MM-dd HH:mm:ss") : null,
        reported_to_name: e.medical_event.reported_to_name,
        reported_to_position: e.medical_event.reported_to_position,
        activity_being_performed: e.medical_event.activity_being_performed,
        last_day_rest: e.medical_event.last_day_rest ? format(new Date(e.medical_event.last_day_rest), "yyyy-MM-dd") : null,
        extra_time: e.medical_event.extra_time,
        activities_outside_work: e.medical_event.activities_outside_work,
        regular_job: e.medical_event.regular_job,
        regular_job_detail: e.medical_event.regular_job_detail,
        personal_protection_equipment: e.medical_event.personal_protection_equipment,
        personal_protection_equipment_detail: e.medical_event.personal_protection_equipment_detail,
        place_event_occurred: e.medical_event.place_event_occurred,
        risk_id: e.medical_event.risk?.id,
        risk_description: e.medical_event.risk_description,
        care_place_id: e.medical_event.care_place?.id,
        medical_care_description: e.medical_event.medical_care_description,
        time_type_id: e.medical_event.time_type?.id,
        used_material: e.medical_event.used_material,
        approximate_cost: e.medical_event.approximate_cost,
        event_evaluation_id: e.medical_event.event_evaluation?.id,
        risk_classification_id: e.medical_event.risk_classification?.id,
        cause_effect_relationship: e.medical_event.cause_effect_relationship,
        event_description_at: e.medical_event.event_description_at ? format(new Date(e.medical_event.event_description_at), "yyyy-MM-dd HH:mm:ss") : null,
        severe_traumatic_event: e.medical_event.severe_traumatic_event,
        incapacity_required: e.medical_event.incapacity_required,
        incapacity_days: e.medical_event.incapacity_days ? e.medical_event.incapacity_days : 0,
        cause_id: e.medical_event.cause?.id,
        event_at: e.medical_event.event_description_at ? format(new Date(e.medical_event.event_description_at), "yyyy-MM-dd HH:mm") : null,
        event_description: e.medical_event.event_description,
        injury_types: this.mapInjury(e.medical_event.injury_types),
        affected_parts: this.mapAffected(e.medical_event.affected_parts),
        medical_event_witnesses: e.medical_event.medical_event_witnesses
      },
      files: e.files && Array.isArray(e.files)
        ? e.files.filter((t: any) => t && (t.id || t.file_id)).map((t: any) => ({ file_id: t.id || t.file_id, comment: e.files_comment || "" }))
        : [],
      files_comment: e.files_comment || ""
    };
  }

  mapDiagnoses(diagnoses: any[]) {
    return diagnoses?.map(t => ({
      human_body_system_id: t.human_body_system_id.id,
      description: t.description
    })) || [];
  }

  ngOnInit(): void {
    this.checkEdit();
  }

  get diagnosesForm() {
    return this.medicalEventForm.get("diagnoses") as FormArray;
  }

  removeInjuryByIndex2(index: number) {
    this.diagnosesForm.removeAt(index);
  }

  addInjury2(data: any = null) {
    this.diagnosesForm.push(this.fb.group({
      human_body_system_id: [null],
      description: [null]
    }));
  }

  mapInjury(injury: any[]) {
    return injury?.map(t => ({
      injury_type_id: t.injury_type_id.id,
      description: t.description
    })) || [];
  }

  mapAffected(affected: any[]) {
    return affected?.map(t => ({
      body_part_detail_id: t.body_part_detail_id.id,
      description: t.description
    })) || [];
  }

  checkEdit() {
    this.getEditData(this.id);
  }

  getEditData(id: any) {
    this.activatedRoute.params.subscribe(t => {
      if (t?.['id']) {
        this._incidentService.show(t['id']).subscribe((r: any) => {
          this.idPatient = r.patient_id;
          this.fillForm(r);
        });
      }
    });
  }

  save() {
    this._incidentService.store(this.mapData).subscribe((e: any) => {
      this._notificationMessage.success(e.message);
      this.router.navigate(["/incident"]);
    });
  }

  get injuryInForm() {
    return this.medicalEventForm.get("medical_event.injury_types") as FormArray;
  }

  removeInjuryByIndex(index: number) {
    this.injuryInForm.removeAt(index);
  }

  addInjury() {
    this.injuryInForm.push(this.fb.group({
      injury_type_id: [null],
      description: [null]
    }));
  }

  get affectPartsInForm() {
    return this.medicalEventForm.get("medical_event.affected_parts") as FormArray;
  }

  removeAffectPartsByIndex(index: number) {
    this.affectPartsInForm.removeAt(index);
  }

  addAffectParts() {
    this.affectPartsInForm.push(this.fb.group({
      body_part_detail_id: [null],
      description: [null]
    }));
  }

  get witenessesInForm() {
    return this.medicalEventForm.get("medical_event.medical_event_witnesses") as FormArray;
  }

  removeWitenessesByIndex(index: number) {
    this.witenessesInForm.removeAt(index);
  }

  addWitenesses() {
    this.witenessesInForm.push(this.fb.group({
      name: [null],
      description: [null],
      description_at: [null]
    }));
  }

  setForm(e: any) {
    this.medicalEventForm.controls['exam'].setValue(e);
  }

  fillForm(e: any) {
    Object.keys(e).forEach(t => {
      switch (t) {
        default:
          if (this.medicalEventForm.get(t) && t !== "medical_event") {
            this.medicalEventForm.controls[t].setValue(e[t]);
          }
          break;
        case "cost_center_type_id":
          this.medicalEventForm.controls['cost_center_type'].setValue({ id: 1, name: "Plantas", code: "foods" });
          break;
        case "diagnoses":
          e.diagnoses.forEach((r: any) => {
            this.diagnosesForm.push(this.fb.group({
              id: [r.id],
              human_body_system_id: [r.human_body_system_id],
              description: [r.description]
            }));
          });
          break;
      }
    });

    if (e.medical_event) {
      Object.keys(e.medical_event).forEach(t => {
        switch (t) {
          default:
            if (this.medicalEventForm.get("medical_event." + t)) {
              this.medicalEventForm.get("medical_event." + t)?.setValue(e.medical_event[t]);
            }
            break;
          case "affected_parts":
            e.medical_event.affected_parts.forEach((h: any) => {
              this.affectPartsInForm.push(this.fb.group({
                id: [h.id],
                body_part_detail_id: [h],
                description: [""]
              }));
            });
            break;
          case "suspension_at":
            let r = format(new Date(e.medical_event.suspension_at), "yyyy-MM-dd");
            this.medicalEventForm.get("medical_event.suspension_at")?.setValue(r);
            break;
          case "event_report_at":
            let s = format(new Date(e.medical_event.event_report_at), "yyyy-MM-dd");
            this.medicalEventForm.get("medical_event.event_report_at")?.setValue(s);
            break;
          case "event_description_at":
            let x = format(new Date(e.medical_event.event_description_at), "yyyy-MM-dd");
            this.medicalEventForm.get("medical_event.event_description_at")?.setValue(x);
            break;
          case "event_cost_center_area_id":
            this.medicalEventForm.get("medical_event.event_cost_center_area")?.setValue(e.medical_event.cost_center_area);
            break;
          case "injury_types":
            e.medical_event.injury_types.forEach((h: any) => {
              this.injuryInForm.push(this.fb.group({
                id: [h.id],
                injury_type_id: [h],
                description: [""]
              }));
            });
            break;
          case "medical_event_witnesses":
            e.medical_event.medical_event_witnesses.forEach((h: any) => {
              this.witenessesInForm.push(this.fb.group({
                id: [h.id],
                name: [h.name],
                description: [h.description]
              }));
            });
            break;
        }
      });
    }
  }

  selectPatient(e?: any) {
    if (e) {
      this._employeeService.listbyCode({ search: this.medicalEventForm.controls['codigo'].value }).subscribe((t: any) => {
        if (t.data[0]) {
          t.data[0].nameComplete = t.data[0].first_name + " " + t.data[0].last_name;
          this.medicalEventForm.controls['patient'].setValue(t.data[0]);
          let r = { ...this.medicalEventForm.value };
          let s = { id: 1, name: "Plantas", code: "foods" };
          this.idPatient = r.patient?.id;
          this.medicalEventForm.controls['cost_center_type'].setValue(s);
          this.medicalEventForm.controls['patient_cost_center'].setValue(r.patient?.cost_center);
          this.medicalEventForm.controls['patient_cost_center_area'].setValue(r.patient?.cost_center_area);
          this.fillForm2(r.patient);
        } else {
          this._notificationMessage.error("Empleado no encontrado");
          this.medicalEventForm.reset();
          this.idPatient = "";
        }
      });
    } else {
      let t = { ...this.medicalEventForm.value };
      let r = { id: 1, name: "Plantas", code: "foods" };
      this.idPatient = t.patient?.id;
      this.medicalEventForm.controls['cost_center_type'].setValue(r);
      this.medicalEventForm.controls['patient_cost_center'].setValue(t.patient?.cost_center);
      this.medicalEventForm.controls['patient_cost_center_area'].setValue(t.patient?.cost_center_area);
      this.fillForm2(t.patient);
    }
  }

  fillForm2(e: any) {
    Object.keys(e).forEach(t => {
      switch (t) {
        default:
          if (this.medicalEventForm.get(t) && t !== "medical_event") {
            this.medicalEventForm.controls[t].setValue(e[t]);
          }
          break;
        case "id":
          this.medicalEventForm.controls['id'].setValue(null);
          break;
      }
    });
  }
}

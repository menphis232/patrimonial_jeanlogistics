import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MovementsService } from '../../services/movements.service';

@Component({
  selector: 'app-store-movements',
  templateUrl: './store-movements.component.html',
  styleUrls: ['./store-movements.component.scss'],
})
export class StoreMovementsComponent implements OnInit {

  form: FormGroup;
  public id: string | null = null;
  public isEditMode = false;

  // Catálogos
  public farmOptions: any[] = [];
  public responsibleOptions: any[] = [];
  public workSchedule: any[] = [];
  public areas: any[] = [];
  public typeOptions: any[] = [];
  public classificationOptions: any[] = [];

  // Secciones Checklist
  public checklistSections: any[] = [];

  // ────────── Getters para los FormArrays ──────────
  get enviromentReports(): FormArray { return this.form.get('enviroment_report') as FormArray; }
  get hazardousMaterials(): FormArray { return this.form.get('hazardous_materials') as FormArray; }
  get spaceDistributions(): FormArray { return this.form.get('space_distributions') as FormArray; }
  get potentialEvents(): FormArray { return this.form.get('potential_events') as FormArray; }
  get observations(): FormArray { return this.form.get('observations') as FormArray; }
  get sections(): FormArray { return this.form.get('sections') as FormArray; }

  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _movementsService: MovementsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params['id'] ?? null;
    this.isEditMode = !!this.id;
    this.buildForm();
    this.loadCatalogs();
    this.loadEvaluationData();

    if (this.id) {
      this.loadVulnerabilityData(this.id);
    }
  }

  buildForm(): void {
    this.form = this.fb.group({
      farm_id:           [null, Validators.required],
      responsible_id:    [null, Validators.required],
      date_evaluation:   [null, Validators.required],
      address:           [''],
      enviroment_report:   this.fb.array([]),
      hazardous_materials: this.fb.array([]),
      space_distributions: this.fb.array([]),
      potential_events:    this.fb.array([]),
      observations:        this.fb.array([]),
      sections:            this.fb.array([]),
    });
  }

  loadCatalogs(): void {
    this._movementsService.getFarms().subscribe(e => this.farmOptions = e ?? []);
    this._movementsService.getResponsibles().subscribe(e => this.responsibleOptions = e ?? []);
    this._movementsService.getWorkSchedules().subscribe(e => this.workSchedule = e ?? []);
    this._movementsService.getAreas().subscribe(e => this.areas = e ?? []);
    this._movementsService.getPotentialEventTypes().subscribe(e => this.typeOptions = e ?? []);
    this._movementsService.getPotentialEventClassifications().subscribe(e => this.classificationOptions = e ?? []);
  }

  loadEvaluationData(): void {
    // instrument 1 = Vulnerability Checklist
    this._movementsService.getEvaluationData(1).subscribe({
      next: (e: any) => {
        this.checklistSections = e?.data?.sections ?? [];
        const sectionControls = this.createSections(this.checklistSections);
        this.form.setControl('sections', this.fb.array(sectionControls));
        
        // Si ya cargaron los datos de modo edición, mapeamos aquí:
        if (this.isEditMode && this.form.value.loadedRisks) {
          this.mapRisksToSections(this.form.value.loadedRisks);
        }
      },
      error: (err: any) => console.error("Error loading evaluation data:", err)
    });
  }

  createSections(sections: any[]): FormGroup[] {
    return sections.map(sec => {
      const questions = sec.questions?.map((q: any) =>
        this.fb.group({
          question_id:   [q.id],
          question_name: [q.name],
          answers:       [q.answers ?? []],
          answer_id:     [null],
          answer_text:   [''],
        })
      ) || [];
      return this.fb.group({
        section_id:   [sec.id],
        section_name: [sec.name],
        questions:    this.fb.array(questions),
      });
    });
  }

  // ────────── Carga modo edición ──────────
  loadVulnerabilityData(id: string): void {
    this._movementsService.show(id).subscribe((res: any) => {
      const data = res.data || res;
      this.form.patchValue({
        farm_id:         data.farm_id,
        responsible_id:  data.responsible_id,
        date_evaluation: data.date_evaluation,
        address:         data.address,
        loadedRisks:     data.risks // temporal property to hold risks until checklist loads
      });

      data.enviroment_report?.forEach((r: any) => this.enviromentReports.push(this.buildEnviromentReport(r)));
      data.hazardous_materials?.forEach((m: any) => this.hazardousMaterials.push(this.buildHazardousMaterial(m)));
      data.space_distributions?.forEach((s: any) => this.spaceDistributions.push(this.buildSpaceDistribution(s)));
      data.potential_events?.forEach((e: any) => this.potentialEvents.push(this.buildPotentialEvent(e)));
      data.observations?.forEach((o: any) => this.observations.push(this.buildObservation(o)));
      
      if (this.sections.length > 0 && data.risks) {
        this.mapRisksToSections(data.risks);
      }
    });
  }

  mapRisksToSections(risks: any[]) {
    risks.forEach((risk: any) => {
      const sectionIdx = this.sections.controls.findIndex(
        s => Number(s.get('section_id')?.value) === Number(risk.section_id)
      );
      if (sectionIdx >= 0) {
        const questions = this.sections.at(sectionIdx).get('questions') as FormArray;
        const qIdx = questions.controls.findIndex(q => Number(q.get('question_id')?.value) === Number(risk.question_id));
        if (qIdx >= 0) {
          questions.at(qIdx).patchValue({ answer_id: risk.answer_id ?? null, answer_text: risk.answer_text ?? null });
        }
      }
    });
  }

  // ────────── Cambio de granja ──────────
  onFarmChange(farmId: any): void {
    const farm = this.farmOptions.find(f => f.id === farmId);
    if (farm) {
      this.form.patchValue({
        responsible_id: farm.responsible_id ?? null,
        address: farm.address ?? null,
      });
    }
  }

  // ────────── Constructores de grupos ──────────
  buildEnviromentReport(data: any = {}): FormGroup {
    return this.fb.group({
      file_id:     [data.file_id ?? null],
      description: [data.description ?? ''],
    });
  }

  buildHazardousMaterial(data: any = {}): FormGroup {
    return this.fb.group({ name: [data.name ?? '', Validators.required] });
  }

  buildSpaceDistribution(data: any = {}): FormGroup {
    return this.fb.group({
      farm_area_id:             [data.farm_area_id ?? null],
      description:              [data.description ?? ''],
      area_meters:              [data.area_meters ?? ''],
      persons:                  [data.persons ?? ''],
      activities:               [data.activities ?? ''],
      dangerous_sustances:      [data.dangerous_sustances ?? false],
      work_schedule_id:         [data.work_schedule_id ?? null],
      working_hour_description: [data.working_hour_description ?? ''],
    });
  }

  buildPotentialEvent(data: any = {}): FormGroup {
    return this.fb.group({
      classification_id:          [data.classification_id ?? null],
      type_id:                    [data.type_id ?? null],
      event_date:                 [data.event_date ?? null],
      classification_description: [data.classification_description ?? ''],
      observations:               [data.observations ?? ''],
    });
  }

  buildObservation(data: any = {}): FormGroup {
    return this.fb.group({
      title:       [data.title ?? '', Validators.required],
      description: [data.description ?? ''],
      files:       this.fb.array(data.files?.map((f: any) => this.buildObservationFile(f)) || []),
    });
  }

  buildObservationFile(data: any = {}): FormGroup {
    return this.fb.group({ file_id: [data.file_id ?? null] });
  }

  // ────────── Agregar/Remover filas ──────────
  addEnviromentReport()  { this.enviromentReports.push(this.buildEnviromentReport()); }
  addHazardousMaterial() { this.hazardousMaterials.push(this.buildHazardousMaterial()); }
  addSpaceDistribution() { this.spaceDistributions.push(this.buildSpaceDistribution()); }
  addPotentialEvent()    { this.potentialEvents.push(this.buildPotentialEvent()); }
  addObservation()       { this.observations.push(this.buildObservation()); }

  removeRow(array: FormArray, i: number) { array.removeAt(i); }
  
  removeEnviromentReport(i: number) { this.enviromentReports.removeAt(i); }
  removeSpaceDistribution(i: number) { this.spaceDistributions.removeAt(i); }
  removePotentialEvent(i: number) { this.potentialEvents.removeAt(i); }

  addObservationFile(obsIndex: number): void {
    const files = (this.observations.at(obsIndex).get('files') as FormArray);
    files.push(this.buildObservationFile());
  }

  removeObservationFile(obsIndex: number, fileIndex: number): void {
    const files = (this.observations.at(obsIndex).get('files') as FormArray);
    files.removeAt(fileIndex);
  }

  getObservationFiles(obsIndex: number): FormArray {
    return this.observations.at(obsIndex).get('files') as FormArray;
  }

  getSectionQuestions(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('questions') as FormArray;
  }

  hasAnswerOptions(sectionIndex: number, questionIndex: number): boolean {
    const answers = this.sections.at(sectionIndex).get('questions') as FormArray;
    return (answers.at(questionIndex).get('answers')?.value?.length ?? 0) > 0;
  }

  // ────────── Guardar ──────────
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload = { ...this.form.value };
    if(this.id) payload.id = this.id;
    // remove loadedRisks from payload
    delete payload.loadedRisks;

    this._movementsService.store(payload).subscribe({
      next: (response: any) => {
        this._notificationMessage.success(response?.message ?? 'Guardado correctamente');
        this.router.navigate(['/movements/list']);
      },
      error: (err: any) => {
        console.error(err);
        this._notificationMessage.error('Error al guardar la evaluación');
      }
    });
  }
}

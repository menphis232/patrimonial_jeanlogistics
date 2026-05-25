import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../services/patient.service';
import { Router,ActivatedRoute } from '@angular/router';
import { IResponse } from 'src/app/shared/interfaces/response.interface';
import { ExamsComponent } from '../../../../shared/components/exams/exams.component';
import { format } from 'date-fns';
@Component({
  selector: 'app-store-patient',
  templateUrl: './store-patient.component.html',
  styleUrls: ['./store-patient.component.scss'],
})
export class StorePatientComponent implements OnInit {

  @Input() id: string | null = null;
  @ViewChild('examsComponent') examsComponent: ExamsComponent;
  form: FormGroup;
  workSpace:any
  constructor(
    private fb: FormBuilder,
    private _notificationMessage: ToastrService,
    private _patientService: PatientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { 
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      code: ['', Validators.required],
      farm_type: ['', Validators.required],
      building: [''],
      phone_1: ['', Validators.required],
      phone_2: [''],
      email: [''],
      latitude: [null],
      longitude: [null], 
      location_image: [null],
      address:[''],
      colony: [''],
      street: [''],
      state: [''],
      CP: [''],
      responsible: [''],
      permanent_operative_employees: [''],
      permanent_admin_employees: [''],
      temporal_operative_employees: [''],
      temporal_admin_employees: [''],
      unionized_operative_employees: [''],
      unionized_admin_employees: [''],

      activities: this.fb.array([]),
      files: [null],

    });
  }


  get mapData() {
    const formValue = { ...this.form.value };
    console.log('location_image value:', formValue.location_image); // Para debug
   
    return {
      id: formValue.id,
      name: formValue.name,
      code: formValue.code,
      farm_type_id: formValue.farm_type?.id,
      building_id: formValue.building?.id,
      phone_1: formValue.phone_1,
      phone_2: formValue.phone_2,
      email: formValue.email,
      latitude: formValue.latitude,
      longitude: formValue.longitude,      
      location_image_id: formValue.location_image?.[0]?.id || formValue.location_image?.id || null,
      address: formValue.address,
      colony: formValue.colony,
      street: formValue.street,
      state: formValue.state,
      CP: formValue.CP,
      responsible_id: formValue.responsible?.id,
      permanent_operative_employees: formValue.permanent_operative_employees,
      permanent_admin_employees: formValue.permanent_admin_employees,
      temporal_operative_employees: formValue.temporal_operative_employees,
      temporal_admin_employees: formValue.temporal_admin_employees,
      unionized_operative_employees: formValue.unionized_operative_employees,
      unionized_admin_employees: formValue.unionized_admin_employees,
      activities: this.mapDiagnoses(formValue.activities),
      files: formValue.files?.map(file => ({
        file_id: file.id || file.file_id,
        description: file.description || 'ubicacion'
      })) || [],
    }
  }
  mapDiagnoses(diagnoses: any[]) {

    return diagnoses?.map(diagnoses => {
   
      return {
        farm_activity_id: diagnoses.farm_activity_id.id,
        description: diagnoses.description,
 
      }
    }) || []

  }

  mapImg(image: any[]) {
    console.log('hola',image)
    return image?.map(diagnoses => {
    
      return {
        farm_activity_id: diagnoses.farm_activity_id.id,
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

        this._patientService.show(param?.['id']).subscribe((response: any) => {
          this.form.patchValue({
            id: param?.['id']
          });
          this.fillForm(response)
          
        })

      }
    })
  
  }

  save() {
    console.log(this.mapData)

    this.form.markAllAsTouched();

    // if (this.form.invalid)
    //   return

    this._patientService.store(this.mapData)
      .subscribe((response: IResponse) => {
        this._notificationMessage.success(response.message);
        this.router.navigate(["/patient"])
      })
  }

  /**FUNCTION ALLERGIES */

  get allergiesInForm(): FormArray {
    return this.form.get('activities') as FormArray;
  }

  addAllergie(params?) {
    this.allergiesInForm.push(
      this.fb.group({
        farm_activity_id: [null],
        description: [null],
      })
    );
  }

  removeAllergieByIndex(index: number) {
    this.allergiesInForm.removeAt(index);
  }

 
 

    /**
   * Llenar el formulario
   * 
   * @param data Data
   */
    fillForm(data){

    
      Object.keys(data.data).forEach((key) => {
        switch (key) {
    
          default:
            if (this.form.get(key)) {
              console.log('keys',key,'----.',data.data[key])
              this.form.controls[key].setValue(data.data[key]);
            }
          break;
       
       
        case 'activities':
          if (data.data[key] && Array.isArray(data.data[key])) {
            data.data[key].forEach((activity) => {
              this.addAllergie(activity);
            });
          }
          break;

        case 'location_image':
          if (data.data[key]) {
            const imageData = Array.isArray(data.data[key]) 
                ? data.data[key][0] 
                : data.data[key];
            this.form.patchValue({
                location_image: imageData
            });
          }
          break;

        }
  
     });
    }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
        // El dropzone debería manejar la carga y devolver el objeto con id
        this._patientService.uploadFile(file).subscribe(response => {
            this.form.patchValue({
                location_image: response.data // Asumiendo que response.data tiene el id
            });
        });
    }
  }

  removeImage() {
    this.form.patchValue({
        location_image: null
    });
  }

  onDropzoneChange(event: any) {
    console.log('Dropzone value changed:', event); // Para debug
    
    // Verificar si el evento tiene files
    if (event?.target?.files?.length > 0) {
        const file = event.target.files[0];
        this._patientService.uploadFile(file).subscribe(response => {
            this.form.patchValue({
                location_image: response.data
            });
        });
    } else if (event?.addedFiles?.length > 0) {
        // Si el evento viene del dropzone directamente
        const file = event.addedFiles[0];
        this._patientService.uploadFile(file).subscribe(response => {
            this.form.patchValue({
                location_image: response.data
            });
        });
    }
  }

}

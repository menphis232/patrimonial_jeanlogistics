import { Component, forwardRef, Input, OnInit,EventEmitter, Output, SimpleChanges  } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import{ExamsService} from '../../services/exams.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExamsComponent),
      multi: true,
    },
  ],
})


export class ExamsComponent implements OnInit {
  @Output() examChange = new EventEmitter<any>();
  @Input() cargo:any;
  @Input() edit:any
  form: FormGroup;

  constructor(private fb: FormBuilder,private examsService:ExamsService) {
  
    this.form = this.fb.group({
      aptitude: ['Aptitude'],
      observations:['n/a'],
      id:[''],
      recomendations:['n/a'],
      event_at:[format(new Date(), 'yyyy-MM-dd')],
      files: [],
  
   
      qs: this.fb.group({
        id:[''],
        patient_id:[''],
        patient_exam_id:[''],
        created_at:[''],
        updated_at:[''],
        bh:[''],
        qs:[''],
        qs_id: [''],
        bh_id: [''],
        spirometry: [''],
        spirometry_id: [''],
        observations: [''],
         files: [],
      }),
      somatometry: this.fb.group({
        id:[''],
        patient_id:[''],
        patient_exam_id:[''],
        created_at:[''],
        updated_at:[''],
        size: ['', [this.sizeValidator]],
        weight: ['',[this.weightValidator]],
        abdominal_perimetera: ['', [this.abdominalValidator]],
        imc: [''],
        systolic_presure: ['',[this.presureValidator]],
        diastolic_presure: ['',[this.presureValidator]],
        heart_rate: ['',[this.heartValidator]],
        observations: [''],
        files: [],
      }),
      antidoping: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        result_id: [''],
        result: [''],
        observations: [''],
         files: [],
      }),

 
      sgsa: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        exfar: [''],
        rf: [''],
        copro: [''],
        exfar_id: [''],
        rf_id: [''],
        copro_id: [''],
         files: [],
      }),
       muscoskeletals: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        mobility_arches: [''],
        mobility_arches_id: [''],
        bone_scan: [''],
        observations: [''],
         files: [],
      }),


      spirometry: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        result: [''],
        result_id: [''],
        observations: [''],
        files: [],
      }),

   
      audiometry: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        ear_right: [''],
        ear_left: [''],
        ear_right_id: [''],
        ear_left_id: [''],
        observations: [''],
        files: [],
      }),
   
      campimetry: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        eye_right: [''],
        eye_left: [''],
        eye_right_id: [''],
        eye_left_id: [''],
        observations: [''],
        files: [],
      }),
      radiation_safety: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

      emergency_brigades: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

      welding_fumes: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

      taec: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

      rcacv: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

       lumbar_rx: this.fb.group({
        id:[''],
        patient_id:[''],
        created_at:[''],
        updated_at:[''],
        patient_exam_id:[''],
        observations: [''],
        files: [],
      }),

    });

    
   }
   weightValidator(control: AbstractControl): ValidationErrors | null {
    const weight = control.value;
    return weight < 35 || weight > 200 ? { weightRange: true } : null;
  }
  abdominalValidator(control: AbstractControl): ValidationErrors | null {
    const abdominal = control.value;
    return abdominal < 60 || abdominal > 150 ? { abdominalRange: true } : null;
  }
  presureValidator(control: AbstractControl): ValidationErrors | null {
    const presure = control.value;
    return presure < 40 || presure > 200 ? { presureRange: true } : null;
  }
  heartValidator(control: AbstractControl): ValidationErrors | null {
    const heart = control.value;
    return heart < 35 || heart > 160 ? { heartRange: true } : null;
  }
  sizeValidator(control: AbstractControl): ValidationErrors | null {
    const size = control.value;
    return size < 135 || size > 205 ? { sizeRange: true } : null;
  }
  
   get mapData() {

    const formValue = { ...this.form.value };
    let arrayFix

    function createDetailsObject(formValue2) {
      const detailss = {
        qs: {},
        somatometry: {},
        antidoping: {},
        sgsa: {},
        muscoskeletals: {},
        spirometry: {},
        audiometry: {},
        campimetry: {},
        radiation_safety: {},
        emergency_brigades: {},
        welding_fumes: {},
        taec: {},
        rcacv: {},
        lumbar_rx: {}
      };
    
      // Helper function to conditionally add properties
      const addPropertyIfNotEmpty = (obj, key, value) => {
        if (value !== undefined && value !== null) {
          obj[key] = value;
        }
      };
    
       // Populate qs
  addPropertyIfNotEmpty(detailss.qs, 'qs_id', formValue2.qs?.qs?.id);
  addPropertyIfNotEmpty(detailss.qs, 'bh_id', formValue2.qs?.bh?.id);
  addPropertyIfNotEmpty(detailss.qs, 'spirometry_id', formValue2.qs?.spirometry?.id);
  addPropertyIfNotEmpty(detailss.qs, 'observations', formValue2.qs?.observations);
  // Add files property if needed:
   addPropertyIfNotEmpty(detailss.qs, 'files', formValue2.qs?.files?.map(file => file.id));

  // Populate somatometry
  addPropertyIfNotEmpty(detailss.somatometry, 'size', formValue2.somatometry?.size);
  addPropertyIfNotEmpty(detailss.somatometry, 'weight', formValue2.somatometry?.weight);
  addPropertyIfNotEmpty(detailss.somatometry, 'abdominal_perimetera', formValue2.somatometry?.abdominal_perimetera);
  addPropertyIfNotEmpty(detailss.somatometry, 'imc', formValue2.somatometry?.imc);
  addPropertyIfNotEmpty(detailss.somatometry, 'systolic_presure', formValue2.somatometry?.systolic_presure);
  addPropertyIfNotEmpty(detailss.somatometry, 'diastolic_presure', formValue2.somatometry?.diastolic_presure);
  addPropertyIfNotEmpty(detailss.somatometry, 'heart_rate', formValue2.somatometry?.heart_rate);
  addPropertyIfNotEmpty(detailss.somatometry, 'observations', formValue2.somatometry?.observations);
  // Add files property if needed:
  addPropertyIfNotEmpty(detailss.somatometry, 'files', formValue2.somatometry?.files?.map(file => file.id));

  // Populate antidoping
  addPropertyIfNotEmpty(detailss.antidoping, 'result_id', formValue2.antidoping?.result?.id);
  addPropertyIfNotEmpty(detailss.antidoping, 'observations', formValue2.antidoping?.observations);
  // Add files property if needed:
  addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.antidoping?.files?.map(file => file.id));

  // Populate sgsa
  addPropertyIfNotEmpty(detailss.sgsa, 'exfar_id', formValue2.sgsa?.exfar?.id);
  addPropertyIfNotEmpty(detailss.sgsa, 'rf_id', formValue2.sgsa?.rf?.id);
  addPropertyIfNotEmpty(detailss.sgsa, 'copro_id', formValue2.sgsa?.copro?.id);
  // Add files property if needed:
  addPropertyIfNotEmpty(detailss.sgsa, 'files', formValue2.sgsa?.files?.map(file => file.id));

  // Populate muscoskeletals
  addPropertyIfNotEmpty(detailss.muscoskeletals, 'mobility_arches_id', formValue2.muscoskeletals?.mobility_arches?.id);
  addPropertyIfNotEmpty(detailss.muscoskeletals, 'bone_scan', formValue2.muscoskeletals?.bone_scan);
  addPropertyIfNotEmpty(detailss.muscoskeletals, 'observations', formValue2.muscoskeletals?.observations);
  addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.muscoskeletals?.files?.map(file => file.id));
  // Add files property if needed:
  // addPropertyIfNotEmpty(detailss.musc
    
      // Populate audiometry
      addPropertyIfNotEmpty(detailss.audiometry, 'ear_right_id', formValue2.audiometry?.ear_right?.id);
      addPropertyIfNotEmpty(detailss.audiometry, 'ear_left_id', formValue2.audiometry?.ear_left?.id);
      addPropertyIfNotEmpty(detailss.audiometry, 'observation', formValue2.audiometry?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.audiometry?.files?.map(file => file.id));
    
      // Populate campimetry
      addPropertyIfNotEmpty(detailss.campimetry, 'eye_right_id', formValue2.campimetry?.eye_right?.id);
      addPropertyIfNotEmpty(detailss.campimetry, 'eye_left_id', formValue2.campimetry?.ear_left?.id); // Assuming this should be 'eye_left_id'
      addPropertyIfNotEmpty(detailss.campimetry, 'observation', formValue2.campimetry?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.campimetry?.files?.map(file => file.id));
    
      // Populate radiation_safety
      addPropertyIfNotEmpty(detailss.radiation_safety, 'observation', formValue2.radiation_safety?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.radiation_safety?.files?.map(file => file.id));
    
      // Populate emergency_brigades
      addPropertyIfNotEmpty(detailss.emergency_brigades, 'observations', formValue2.emergency_brigades?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.emergency_brigades?.files?.map(file => file.id));
    
      // Populate welding_fumes
      addPropertyIfNotEmpty(detailss.welding_fumes, 'observations', formValue2.welding_fumes?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.welding_fumes?.files?.map(file => file.id));
    
      // Populate taec
      addPropertyIfNotEmpty(detailss.taec, 'observations', formValue2.taec?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.taec?.files?.map(file => file.id));
    
      // Populate rcacv
      addPropertyIfNotEmpty(detailss.rcacv, 'observations', formValue2.rcacv?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.rcacv?.files?.map(file => file.id));
    
      // Populate lumbar_rx
      addPropertyIfNotEmpty(detailss.lumbar_rx, 'observations', formValue2.lumbar_rx?.observations);
      addPropertyIfNotEmpty(detailss.antidoping, 'files', formValue2.lumbar_rx?.files?.map(file => file.id));
    
      return detailss;
    }
    
    function removeEmptyObjects(obj) {
      for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmptyObjects(obj[key]);
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key];
          }
        } else if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        }
      }
    }

  
    const details = createDetailsObject(formValue);
    removeEmptyObjects(details);
   


    return {
      aptitude_id: formValue.aptitude?.id,
      observations: formValue.observations,
      recomendations: formValue.recomendations,
      event_at:formValue.event_at,
      patient_id:1,
      files: formValue.files ? formValue.files.map(files => files.id) : '',
      details,

       
      
   }

  }
  ngOnInit(): void {
// let coincidences = [];

// for (let key in this.mapData.details) {
//     if (this.mapData.details.hasOwnProperty(key)) {
//         let detailItem = this.mapData.details[key];
//         let matchingAlias = this.cargo.find(item => item.alias === key || item.name === key);
//         if (matchingAlias) {
//             coincidences.push({
//                 id: matchingAlias.id,
//                 name: matchingAlias.name,
//                 alias: matchingAlias.alias,
//                 data: detailItem
//             });
//         }
//     }
// }

// console.log(coincidences);


    this.form.valueChanges.subscribe((formData) => {
      this.examChange.emit(this.mapData); // Emit the form data on every change
     
    });

   
  }


filterDetails(data: any, aliases: any) {

  const aliasLookup = aliases.reduce((acc, item) => ({ ...acc, [item.alias]: item.id }), {});
  const filteredDetails = {};

  for (const key in data) {
    if (aliasLookup[key]) {
      filteredDetails[key] = data[key];
    }
  }

  return filteredDetails;
}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['cargo']) {
    
     
      console.log('cargo changed:', changes['cargo'].currentValue);
      // Perform any additional actions based on cargo changes (optional)
    }
  }

  findExams(nameExam?){
      // console.log('hola',this.edit)
     
    if(this.cargo){
      if(this.edit){
        this.fillForm(this.edit)
      }
      if(!this.cargo.exams){
        this.examsService.showCargo(this.cargo.id).subscribe((response)=>{
          this.cargo=response.data
        })
      }
      const examenEncontrado = this.cargo.exams.find(examen => examen.name === nameExam);
      return examenEncontrado;
    }

  }

  fillForm(data: any): void {
    Object.keys(data).forEach((key) => {
      switch (key) {
        case 'aptitude_id':
        case 'observations':
        case 'recomendations':
        case 'event_at':
          if (this.form.get(key)) {
            this.form.get(key)?.setValue(data[key]);
          }
          break;
  
        case 'somatometry':
          const somatometryData = data[key];
          if (somatometryData) {
            Object.keys(somatometryData).forEach((subKey) => {
              if (this.form.get(`somatometry.${subKey}`)) {
                this.form.get(`somatometry.${subKey}`)?.setValue(somatometryData[subKey]);
              }
            });
            if (somatometryData.files) {
              this.form.get('somatometry.files')?.setValue(somatometryData.files);
            }
          }
          break;
  
        case 'antidoping':
          const antidopingData = data[key];
          if (antidopingData) {
            Object.keys(antidopingData).forEach((subKey) => {
              if (subKey === 'result') {
                Object.keys(antidopingData.result).forEach((resultKey) => {
                  if (this.form.get(`antidoping.result.${resultKey}`)) {
                    this.form.get(`antidoping.result.${resultKey}`)?.setValue(antidopingData.result[resultKey]);
                  }
                });
              } else {
                if (this.form.get(`antidoping.${subKey}`)) {
                  this.form.get(`antidoping.${subKey}`)?.setValue(antidopingData[subKey]);
                }
              }
            });
            if (antidopingData.files) {
              this.form.get('antidoping.files')?.setValue(antidopingData.files);
            }
          }
          break;
  
          case 'sgsa':
            const sgsaData = data[key];
            if (sgsaData) {
              Object.keys(sgsaData).forEach((subKey) => {
                if (sgsaData.hasOwnProperty(subKey)) {
                  if (subKey !== 'exfar' && subKey !== 'rf' && subKey !== 'copro') {
                    if (this.form.get(`sgsa.${subKey}`)) {
                      this.form.get(`sgsa.${subKey}`)?.setValue(sgsaData[subKey]);
                    }
                  } else {
                    const nestedData = sgsaData[subKey];
                    if (nestedData && typeof nestedData === 'object') {
                      Object.keys(nestedData).forEach((nestedKey) => {
                        if (this.form.get(`sgsa.${subKey}.${nestedKey}`)) {
                          this.form.get(`sgsa.${subKey}.${nestedKey}`)?.setValue(nestedData[nestedKey]);
                        }
                      });
                    }
                  }
                }
              });
              if (sgsaData.files) {
                this.form.get('sgsa.files')?.setValue(sgsaData.files);
              }
            }
            break;
          
        case 'spirometry':
          const spirometryData = data[key];
          if (spirometryData) {
            Object.keys(spirometryData).forEach((subKey) => {
              if (this.form.get(`spirometry.${subKey}`)) {
                this.form.get(`spirometry.${subKey}`)?.setValue(spirometryData[subKey]);
              }
            });
            if (spirometryData.files) {
              this.form.get('spirometry.files')?.setValue(spirometryData.files);
            }
          }
          break;
  
        case 'muscoskeletals':
          const muscoskeletalsData = data[key];
          if (muscoskeletalsData) {
            Object.keys(muscoskeletalsData).forEach((subKey) => {
              if (this.form.get(`muscoskeletals.${subKey}`)) {
                this.form.get(`muscoskeletals.${subKey}`)?.setValue(muscoskeletalsData[subKey]);
              }
            });
            if (muscoskeletalsData.files) {
              this.form.get('muscoskeletals.files')?.setValue(muscoskeletalsData.files);
            }
            if (muscoskeletalsData.mobility_arches) {
              const mobilityArchesData = muscoskeletalsData.mobility_arches;
              Object.keys(mobilityArchesData).forEach((subKey) => {
                if (this.form.get(`muscoskeletals.mobility_arches.${subKey}`)) {
                  this.form.get(`muscoskeletals.mobility_arches.${subKey}`)?.setValue(mobilityArchesData[subKey]);
                }
              });
            }
          }
          break;
  
        case 'audiometry':
          const audiometryData = data[key];
          if (audiometryData) {
            Object.keys(audiometryData).forEach((subKey) => {
              if (this.form.get(`audiometry.${subKey}`)) {
                this.form.get(`audiometry.${subKey}`)?.setValue(audiometryData[subKey]);
              }
            });
            if (audiometryData.files) {
              this.form.get('audiometry.files')?.setValue(audiometryData.files);
            }
            if (audiometryData.ear_right) {
              const earRightData = audiometryData.ear_right;
              Object.keys(earRightData).forEach((subKey) => {
                if (this.form.get(`audiometry.ear_right.${subKey}`)) {
                  this.form.get(`audiometry.ear_right.${subKey}`)?.setValue(earRightData[subKey]);
                }
              });
            }
            if (audiometryData.ear_left) {
              const earLeftData = audiometryData.ear_left;
              Object.keys(earLeftData).forEach((subKey) => {
                if (this.form.get(`audiometry.ear_left.${subKey}`)) {
                  this.form.get(`audiometry.ear_left.${subKey}`)?.setValue(earLeftData[subKey]);
                }
              });
            }
          }
          break;
  
        case 'campimetry':
          const campimetryData = data[key];
          if (campimetryData) {
            Object.keys(campimetryData).forEach((subKey) => {
              if (this.form.get(`campimetry.${subKey}`)) {
                this.form.get(`campimetry.${subKey}`)?.setValue(campimetryData[subKey]);
              }
            });
            if (campimetryData.files) {
              this.form.get('campimetry.files')?.setValue(campimetryData.files);
            }
            if (campimetryData.eye_right) {
              const eyeRightData = campimetryData.eye_right;
              Object.keys(eyeRightData).forEach((subKey) => {
                if (this.form.get(`campimetry.eye_right.${subKey}`)) {
                  this.form.get(`campimetry.eye_right.${subKey}`)?.setValue(eyeRightData[subKey]);
                }
              });
            }
            if (campimetryData.eye_left) {
              const eyeLeftData = campimetryData.eye_left;
              Object.keys(eyeLeftData).forEach((subKey) => {
                if (this.form.get(`campimetry.eye_left.${subKey}`)) {
                  this.form.get(`campimetry.eye_left.${subKey}`)?.setValue(eyeLeftData[subKey]);
                }
              });
            }
          }
          break;
  
        case 'radiation_safety':
        case 'emergency_brigades':
        case 'welding_fumes':
        case 'taec':
        case 'rcacv':
        case 'lumbar_rx':
          if (this.form.get(key)) {
            this.form.get(key)?.setValue(data[key]);
          }
          if (data[key].files) {
            this.form.get(`${key}.files`)?.setValue(data[key].files);
          }
          break;
  
       // Aquí puedes agregar más casos para otras secciones del formulario

       default:
        if (this.form.get(key)) {
          this.form.get(key)?.setValue(data[key]);
        }
        break;
      }
    });
  }
  
  

}


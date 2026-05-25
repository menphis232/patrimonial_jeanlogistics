import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { ReportsService } from '../../services/reports.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format, lastDayOfMonth } from 'date-fns';
@Component({
  selector: 'app-list-reports',
  templateUrl: './list-reports.component.html',
  styleUrls: ['./list-reports.component.scss']
})
export class ListReportsComponent implements OnInit {

  public formFilter: FormGroup
  public formFilterEjecutivo: FormGroup
  public formFilterAccidentes: FormGroup
  public formFilterMedicament: FormGroup
  public formFilterRecets: FormGroup
  


  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private _reportsService: ReportsService,
    private _confirmation: ConfirmationService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.formFilter = this.formBuilder.group({
      since: [this.firstDay],
      format:['pdf'],
      until: [new Date()],
      reason_consultation_id:[null]

    })

    this.formFilterEjecutivo = this.formBuilder.group({
      since: [this.firstDay],
      format:['pdf'],
      until: [new Date()],
      reason_consultation_id:[null]

    })

    this.formFilterAccidentes = this.formBuilder.group({
      since: [this.firstDay],
      format:['pdf'],
      until: [new Date()],
  

    })


    this.formFilterMedicament = this.formBuilder.group({
      since: [this.firstDay],
      format:['pdf'],
      until: [new Date()],
  

    })

    this.formFilterRecets = this.formBuilder.group({
      since: [this.firstDay],
      format:['pdf'],
      until: [new Date()],
  

    })

    
    
    
  }


  ngOnInit(): void {

  }

  get firstDay() {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    return '2024-03-01'
  }

  /**/
  get mapData() {

    const formValue = { ...this.formFilter.value };
   

    return {
     
        

      format:formValue.format,
    
      reason_consultation_id:formValue.reason_consultation_id.id,
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    
     
      
    }

  }

  get mapDataEjecutivo() {

    const formValue = { ...this.formFilterEjecutivo.value };
   

    return {
     
        

      format:formValue.format,
    
      reason_consultation_id:formValue.reason_consultation_id.id,
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    
     
      
    }

  }

  get mapDataAccidentes() {

    const formValue = { ...this.formFilterAccidentes.value };
   

    return {
     
        

      format:formValue.format,
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    
     
      
    }

  }

  get mapDataMedicament() {

    const formValue = { ...this.formFilterMedicament.value };
   

    return {
     
        

      format:formValue.format,
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    
     
      
    }

  }

  get mapDataRecets() {

    const formValue = { ...this.formFilterRecets.value };
   

    return {
     
        

      format:formValue.format,
      since: format(new Date(formValue.since), 'yyyy-MM-dd') ,
      until: format(new Date(formValue.until), 'yyyy-MM-dd') ,
    
     
      
    }

  }

  download() {
    this._reportsService.download(this.mapData);
  }

  downloadEjecutivo() {
    this._reportsService.downloadEjecutivo(this.mapDataEjecutivo);
  }

  downloadAccidentes() {
    this._reportsService.downloadAccidentes(this.mapDataAccidentes);
  }

  downloadMedicament() {
    this._reportsService.downloadMedicament(this.mapDataMedicament);
  }

  downloadRecets() {
    this._reportsService.downloadMedicament(this.mapDataRecets);
  }


}

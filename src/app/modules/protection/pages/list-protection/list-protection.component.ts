import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { BehaviorSubject, Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { ProtectionService } from '../../services/protection.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-list-protection',
  templateUrl: './list-protection.component.html',
  styleUrls: ['./list-protection.component.scss'],
})
export class ListProtectionComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  form: FormGroup;
  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'date',
    'farm',
    'create_by',
    'results',
    'actions'
  ];
  // categories$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor(
    private _categoryService: ProtectionService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  get categories$(): Observable<any[]> {
  
    return this.pagination.data$
  }

  ngOnInit(): void {
     const ccDefault=JSON.parse(localStorage.getItem('costCenter'))
    this.form = this.fb.group({
      farm: new FormControl(ccDefault, {
        validators: [Validators.required],
      }),
     

    });
   
   
    this.pagination.changeValues$.subscribe(() => this.paginate())
    this.pagination.next()
  }

  get mapData() {

    const formValue = { ...this.form.value };

    return {
 
      farm_id:formValue.farm?.id,
  
    };
  }

/**
  * After view init
  */
  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page])
  }

  

  paginate(): void {

    this.pagination.perPage = 9;
    //  this.pagination.params=this.mapData
    this._categoryService.list(this.pagination);
  }

  /**
  * Remove record
  * 
  * @param {string} name Nombre del archivo
  */
  destroy(id: string) {
    const dialogRef = this._confirmation.dialogRemove()

    dialogRef.afterClosed().subscribe((result) => {

      if (result != 'confirmed')
        return;

      this._categoryService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }


  convertir(segundosP) {

    const segundos = (Math.round(segundosP % 0x3C)).toString();
    const horas    = (Math.floor(segundosP / 0xE10)).toString();
    const minutos  = (Math.floor(segundosP / 0x3C ) % 0x3C).toString();
              
    return `${horas} horas, ${minutos} minutos y ${segundos} segundos.`;
    
  }
  download(id) {
    // console.log('descarga')
    this._categoryService.download(id);
  }

}

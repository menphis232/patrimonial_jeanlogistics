import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { BehaviorSubject, Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { ErgonomicService } from '../../services/ergonomic.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
 import { ModalQrGuardsComponent } from '../../components/modal-qr-guards/modal-qr-guards.component';

@Component({
  selector: 'app-list-ergonomic',
  templateUrl: './list-ergonomic.component.html',
  styleUrls: ['./list-ergonomic.component.scss']
})
export class ListErgonomicComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  form: FormGroup;
  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'code',
    'farm',
 
    'actions'
  ];
  categories$: BehaviorSubject<any[]> = new BehaviorSubject([]);
  constructor(
    private _categoryService: ErgonomicService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService,
    public dialog: MatDialog,
    private fb: FormBuilder,
  ) {
    this._categoryService.listAreas(this.pagination).subscribe({
      next: (r) => {
           console.log(r);
          this.categories$.next(r.data);
      },
  });

  }

  // get categories$(): Observable<any[]> {
  
  //   return this.pagination.data$
  // }

  ngOnInit(): void {
     const ccDefault=JSON.parse(localStorage.getItem('costCenter'))
    this.form = this.fb.group({
      farm: new FormControl(ccDefault, {
        validators: [Validators.required],
      }),
     

    });
    this.pagination.params = this.mapData;
    this.form.valueChanges.subscribe(()=>{
      
   

      this.pagination.params = this.mapData;
      this._categoryService.listAreas(this.pagination).subscribe({
        next: (r) => {
             console.log(r);
            this.categories$.next(r.data);
        },
    });
     
    })

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
     this.pagination.params=this.mapData
    this._categoryService.listAreas(this.pagination);
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

  openDialog(farm: any): void {
   
    const dialogRef = this.dialog.open(ModalQrGuardsComponent, {
      data: {
        farm: farm,
      
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
    
    });
  }


}

import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
@Injectable({
  providedIn: 'root'
})
export class IncapacityService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "medical_consultations/incapacities";

  /**
   * Data Behaviour
   */
  private _incapacity: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get incapacity$(): Observable<any[]> {
    return this._incapacity.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  list(paginator: MatPagination): void {

    paginator.isLoading = true;

    this.http.get(`${this.prefix}`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._incapacity.next(response.data)
      })

  }


  show(id: string) {
    return this.http.get(`${this.prefix}/${id}`)
      .pipe(
        map((response: any) => response)
      );
  }

  /**
 * Guardar/Actualizar
 * 
 * @param data Data
 * @returns 
 */
  store(data: any): Observable<any> {

    return of(null).pipe(
      switchMap(() => {

        if (data.id)
          return this.http.put(`${this.prefix}/${data.id}`, data);

        return this.http.post(`${this.prefix}`, data);

      }),
    )
  }

  /**
   * Eliminar proyecto
   * 
   * @param {number} id 
   * @returns 
   */
  delete(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  export(prescriptionId, params: { format: string } = { format: 'pdf' }) {
    this.http
      .get(
        `medical_consultations/incapacities/export/${prescriptionId}?format=pdf`,
        {
          responseType: 'blob',
        }
      )
      .subscribe((response) => {
        // saveAs(
        //   response,
        //   `incapacities_${Moment().unix()}.${
        //     params.format === 'excel' ? 'xls' : 'pdf'
        //   }`
        // );

       

        const dialogRef = this.dialog.open(PdfViewerComponent, {
          // console.log('esteeeee ',response)
          data: {
             blob: response,
            src:URL.createObjectURL(response)
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
        
        });
   
      });
  }
}

import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class OperationChangeService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "medical_consultations/operation_changes";

  /**
   * Data Behaviour
   */
  private _operationChange: BehaviorSubject<any[]> = new BehaviorSubject([]);


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
  get operationChange$(): Observable<any[]> {
    return this._operationChange.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  list(paginator: MatPagination): void {

    paginator.isLoading = true;

    this.http.get(`${this.prefix}?with=patient;cost_center_type;cost_center;cost_center_area;work_space;status;operation_change_category;proposed_cost_center_type;proposed_cost_center;proposed_cost_center_area;proposed_work_space`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._operationChange.next(response.data)
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
 * Guardar/Actualizar
 * 
 * @param data Data
 * @returns 
 */
  setControls(data: any): Observable<any> {

    return this.http.put(`${this.prefix}/set_controls/${data.id}`, data);
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
   download(id: number): void {
    this.http.get(`${this.prefix}/export/${id}?format=pdf`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        // this.saveFile(response, `export${id}.pdf`);

        const dialogRef = this.dialog.open(PdfViewerComponent, {
          width: '800px', // Adjust width as needed
          height: '800px', // Adjust height as needed
          panelClass: 'center-dialog',
          data: {
            blob: response,
            src:URL.createObjectURL(response)
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
        
        });
      });
  }
  downloadReport() {
    // Para Probar
    this.http
      .get(`${this.prefix}?format=excel`, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, 'Listado de ingresos');
      });
  }
}

import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class GeneralConsultationService {

  /**
     * Prefix endpoint
     */
  private prefix: string = "medical_consultations/general_consultations";

  /**
   * Data Behaviour
   */
  private _collaborators: BehaviorSubject<any[]> = new BehaviorSubject([]);


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
  get collaborators$(): Observable<any[]> {
    return this._collaborators.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  list(paginator: MatPagination): void {

    paginator.isLoading = true;

    this.http.get(`${this.prefix}?with=cost_center`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._collaborators.next(response.data)
      })

  }


  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=cost_center;cost_center_type;work_space;type_care_medical`)
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

   /**
   * Descargar archivo
   * 
   * @param {number} id 
   * @returns 
   */
  //  download(id: string) {
  //   return this.http.delete(`${this.prefix}/${id}`);
  // }
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

  downloadPresciption(id: number): void {
    this.http.get(`medical_consultations/prescriptions/export/${id}?format=pdf`, { responseType: 'blob' })
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

}


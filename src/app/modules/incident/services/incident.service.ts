import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
import { ModalDetailIncidentComponent } from '../../../modules/incident/components/modal-detail-incident/modal-detail-incident.component';
@Injectable({
  providedIn: 'root'
})
export class IncidentService {

   /**
     * Prefix endpoint
     */
   private prefix: string = "incidences";

   /**
    * Data Behaviour
    */
   private _collaborators: BehaviorSubject<any[]> = new BehaviorSubject([]);
 
 
   constructor(
    public dialog: MatDialog,
     private http: HttpClient
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
 
     this.http.get(`${this.prefix}?with=user;measurement;farm_type;farm;files&orderBy=event_date&sortBy=desc`, { params: paginator.httpParams() })
       .pipe(
         finalize(() => paginator.isLoading = false)
       )
       .subscribe((response: PaginateResponseType) => {
         paginator.update(response)
         this._collaborators.next(response.data)
       })
 
   }
 
 
  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=user;measurement;farm_type;farm;files;incidence_type;department`)
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
    download(id: number) {
      this.http.get(`${this.prefix}/export/${id}`, { responseType: 'blob' })
        .subscribe((response) => {
          const dialogRef = this.dialog.open(PdfViewerComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            panelClass: 'pdf-dialog',
            autoFocus: false,
            data: {
              blob: response,
              src: window.URL.createObjectURL(response)
            }
          });
        });
    }
  
    private saveFile(blob: Blob, fileName: string): void {
      const file = new File([blob], fileName, { type: blob.type });
      saveAs(file);
    }
 
   openDetailDialog(id: number) {
     const dialogRef = this.dialog.open(ModalDetailIncidentComponent, {
       width: '98vw',
       height: '95vh',
       maxWidth: '1800px',
       panelClass: ['full-screen-modal', 'large-modal'],
       data: { id: id }
     });
   }
 
 }
 
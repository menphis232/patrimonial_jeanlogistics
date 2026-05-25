import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
@Injectable({
  providedIn: 'root'
})
export class AccidentService {

   /**
     * Prefix endpoint
     */
   private prefix: string = "medical_consultations/accident_consultations";

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
 
     this.http.get(`${this.prefix}`, { params: paginator.httpParams() })
       .pipe(
         finalize(() => paginator.isLoading = false)
       )
       .subscribe((response: PaginateResponseType) => {
         paginator.update(response)
         this._collaborators.next(response.data)
       })
 
   }
 
 
   show(id: string) {
     return this.http.get(`${this.prefix}/${id}?with=medical_event.affected_parts;medical_event.injury_types;medical_event.care_place;medical_event.risk;medical_event.time_type;medical_event.cause;medical_event.event_evaluation;medical_event.risk_classification`)
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


   download(id: number): void {
    this.http.get(`${this.prefix}/export/${id}?format=pdf`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        // this.saveFile(response, `export${id}.pdf`);

        const dialogRef = this.dialog.open(PdfViewerComponent, {
          width: '100%',
          data: {
            blob: response,
            src:URL.createObjectURL(response)
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
        
        });
      });
  }

  private saveFile(blob: Blob, fileName: string): void {
    const file = new File([blob], fileName, { type: blob.type });
    saveAs(file);
  }
 
 }
 
import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
@Injectable({
  providedIn: 'root'
})
export class ErgonomicService {

   /**
     * Prefix endpoint
     */
   private prefix: string = "safety_tours";

   /**
    * Data Behaviour
    */
   private _collaborators: BehaviorSubject<any[]> = new BehaviorSubject([]);
   private _tours: BehaviorSubject<any[]> = new BehaviorSubject([]);
 
 
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

   get tours$(): Observable<any[]> {
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
         this._tours.next(response.data)
       })
 
   }

//    list(paginator: MatPagination): Observable<any> {
//     return this.http.get(`${this.prefix}`, { params: paginator.httpParams() });
// }

  //  listAreas(paginator: MatPagination): void {
 
  //   paginator.isLoading = true;
    

  //   this.http.get(`${environment.loginUrl}areas`, { params: paginator.httpParams() })
  //     .pipe(
  //       finalize(() => paginator.isLoading = false)
  //     )
  //     .subscribe((response: PaginateResponseType) => {
  
  //       paginator.update(response)
  //       this._collaborators.next(response)
  //     })

  // }

  listAreas(paginator: MatPagination): Observable<any> {
    paginator.isLoading = true;
    
    return this.http.get(`${environment.loginUrl}areas?with=area_type`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false),
        map((response: any) => {
          // Actualizar la paginación con la respuesta
          paginator.update(response);
          return response;
        })
      );
}

  /**
   * Obtener tipos de área
   * 
   * @returns Observable con los tipos de área
   */
  areaTypes(): Observable<any> {
    return this.http.get(`${environment.loginUrl}catalogs?name=farm_area_types&table_name=farm_areas`)
      .pipe(
        map((response: any) => response)
      );
  }
 
 
   show(id: string) {
     return this.http.get(`${this.prefix}/${id}?with=safety_tour_details.quesses;safety_tour_details.files;photo;security_guard`)
       .pipe(
         map((response: any) => response)
       );
   }

   showArea(id: string) {
    return this.http.get(`${environment.loginUrl}areas/${id}?with=files;work_schedule;shared_areas;area_type`)
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
   storeArea(data: any): Observable<any> {
 
     return of(null).pipe(
       switchMap(() => {
 
         if (data.id)
           return this.http.put(`${environment.loginUrl}areas/${data.id}`, data);
 
         return this.http.post(`${environment.loginUrl}areas`, data);
 
       }),
     )
   }

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
      this.http.get(`${this.prefix}/export/${id}?type=food`, { responseType: 'blob' })
        .subscribe((response: Blob) => {
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
 
 }
 
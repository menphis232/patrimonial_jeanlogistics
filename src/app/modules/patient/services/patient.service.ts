import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

    /**
     * Prefix endpoint
     */
  private prefix: string = "farms";

  /**
   * Data Behaviour
   */
  private _patients: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private http: HttpClient
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get patients$(): Observable<any[]> {
    return this._patients.asObservable();
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
        this._patients.next(response.data)
      })

  }


  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=activities;files;farm_type;building`)
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
   download(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.prefix}/upload`, formData);
  }

}

import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

/**
     * Prefix endpoint
     */
private prefix: string = "work_spaces";

/**
 * Data Behaviour
 */
private _collaborators: BehaviorSubject<any[]> = new BehaviorSubject([]);


constructor(
  private http: HttpClient,

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





show(id: string) {
  return this.http.get(`${this.prefix}/${id}?with=exams`)
    .pipe(
      map((response: any) => response)
    );
}

showCargo(id: string) {
  return this.http.get(`work_spaces/${id}`)
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




}

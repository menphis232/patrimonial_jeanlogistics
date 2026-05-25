import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "inventories/articles";

  /**
   * Data Behaviour
   */
  private _brands: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private http: HttpClient
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get brands$(): Observable<any[]> {
    return this._brands.asObservable();
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
        this._brands.next(response.data)
      })

  }


  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=presentation`)
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
}

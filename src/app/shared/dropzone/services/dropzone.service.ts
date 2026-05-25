import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DropzoneService {

  private prefix = 'files';

  constructor(
    private http: HttpClient
  ) { }

  /**
 * Guardar/Actualizar
 * 
 * @param data Data
 * @returns 
 */
  store(formData: any): Observable<any> {

    return this.http.post(`${environment.apiUrl}/files`, formData);
  }


  delete(apiDelete: string): Observable<any> {

    return this.http.delete(apiDelete)
  }
}

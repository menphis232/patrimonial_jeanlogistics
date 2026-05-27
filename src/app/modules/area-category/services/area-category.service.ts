import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreaCategoryService {
  private baseUrl = `${environment.loginUrl}farms/area-categories`;

  constructor(private http: HttpClient) {}

  list(params?: any): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, { params });
  }

  show(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  save(data: any): Observable<any> {
    return of(null).pipe(
      switchMap(() => data.id 
        ? this.http.put<any>(`${this.baseUrl}/${data.id}`, data) 
        : this.http.post<any>(this.baseUrl, data)
      )
    );
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}

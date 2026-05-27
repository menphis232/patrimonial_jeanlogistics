import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {
  private prefix = 'vulnerability-points/responsibles';

  constructor(private http: HttpClient) { }

  list(pagination: any): void {
    pagination.isLoading = true;

    const params = new HttpParams()
      .set('page', pagination.pageIndex + 1)
      .set('with', 'farm')
      .set('per_page', pagination.perPage || 10)
      .set('search', pagination.search || '');

    this.http.get<any>(this.prefix, { params }).subscribe(
      (response) => {
        pagination.total = response.total || 0;
        pagination.data  = response.data  || [];
        pagination.isLoading = false;
        pagination.dataSubject.next(pagination.data);
      },
      () => {
        pagination.isLoading = false;
        pagination.dataSubject.next([]);
      }
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.prefix}/${id}?with=farm`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.prefix, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.prefix}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.prefix}/${id}`);
  }
}

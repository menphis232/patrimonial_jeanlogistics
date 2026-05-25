import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {
  private apiUrl = `${environment.apiUrl}/vulnerability-points/responsibles`;

  constructor(private http: HttpClient) { }

  list(pagination: any): void {
    pagination.isLoading = true;
    
    const params = new HttpParams()
      .set('page', pagination.pageIndex + 1)
      .set('with', 'farm')
      .set('per_page', pagination.perPage || 10)
      .set('search', pagination.search || '');
      
    this.http.get<any>(this.apiUrl, { params }).subscribe(
      (response) => {
        console.log('Respuesta del API:', response); // Para depuración
        
        // Actualizar con la estructura correcta de la respuesta
        pagination.total = response.total || 0;
        pagination.data = response.data || [];
        pagination.isLoading = false;
        
        // Emitir los datos actualizados
        pagination.dataSubject.next(pagination.data);
      },
      (error) => {
        console.error('Error al obtener responsables:', error);
        pagination.isLoading = false;
        pagination.dataSubject.next([]);
      }
    );
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}?with=farm`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
} 

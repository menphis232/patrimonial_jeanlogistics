import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private baseUrl = `${environment.apiurl}/vulnerability-points/corrective_actions`;

  constructor(private http: HttpClient) { }

  getAction(id: string, vulnerabilityPointId: string): Observable<any> {
    const params = { vulnerability_point_id: vulnerabilityPointId, with: 'evidences' };
    return this.http.get(`${this.baseUrl}/${id}`, { params });
  }

  completeAction(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/complete/${id}`, data);
  }
} 
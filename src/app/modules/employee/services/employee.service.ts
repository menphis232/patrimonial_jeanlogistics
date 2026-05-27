import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private prefix = "employees";
  private _patients = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {}

  get patients$(): Observable<any[]> {
    return this._patients.asObservable();
  }

  list(paginator: any): void {
    paginator.isLoading = true;
    this.http.get<any>(`${this.prefix}?with=turn;work_space;blood_type;cost_center;cost_center_area`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe(e => {
        paginator.update(e);
        this._patients.next(e.data);
      });
  }

  show(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.prefix}/${id}?with=turn;work_space;blood_type;exams.qs`);
  }

  show2(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.prefix}/${id}?with=cost_center;cost_center_area`);
  }

  listbyCode(params: any): Observable<any> {
    return this.http.get<any>(`${this.prefix}?with=turn;work_space;blood_type;cost_center;cost_center_area&per_page=1`, { params });
  }

  store(data: any): Observable<any> {
    return of(null).pipe(
      switchMap(() => data.id
        ? this.http.put<any>(`${this.prefix}/${data.id}`, data)
        : this.http.post<any>(`${this.prefix}`, data)
      )
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.prefix}/${id}`);
  }

  download(fileName: string): void {
    this.http.get(`files/download/${fileName}`, { responseType: 'blob' }).subscribe(e => {
      saveAs(e, fileName);
    });
  }

  downloadReport(): void {
    this.http.get(`${this.prefix}?format=excel`, { responseType: 'blob' }).subscribe(t => {
      saveAs(t, "Listado de ingresos");
    });
  }
}

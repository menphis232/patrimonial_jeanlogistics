import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import * as fileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExpedientsService {
  private prefix = 'expedients';

  private _collaborators = new BehaviorSubject<any[]>([]);
  private _tours = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  get collaborators$(): Observable<any[]> {
    return this._collaborators.asObservable();
  }

  get tours$(): Observable<any[]> {
    return this._tours.asObservable();
  }

  list(pagination: any): void {
    pagination.isLoading = true;
    this.http.get<any>(`${this.prefix}`, {
      params: pagination.httpParams()
    }).pipe(
      finalize(() => pagination.isLoading = false)
    ).subscribe(res => {
      pagination.update(res);
      this._tours.next(res.data);
    });
  }

  listAreasOld(pagination: any): Observable<any> {
    return this.http.get<any>(`${this.prefix}`, {
      params: pagination.httpParams()
    });
  }

  listAreas(pagination: any): void {
    pagination.isLoading = true;
    let params = pagination.httpParams();
    params = params.delete('farm_id');

    this.http.get<any>(`${this.prefix}`, {
      params: params
    }).pipe(
      finalize(() => pagination.isLoading = false)
    ).subscribe(res => {
      pagination.update(res);
      this._collaborators.next(res.data);
    });
  }

  show(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.prefix}/${id}`).pipe(
      map(res => res)
    );
  }

  showArea(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.prefix}/${id}?with=farm;gerency`).pipe(
      map(res => res)
    );
  }

  storeArea(payload: any): Observable<any> {
    return of(null).pipe(
      switchMap(() => payload.id ? this.http.put<any>(`${this.prefix}/${payload.id}`, payload) : this.http.post<any>(`${this.prefix}`, payload))
    );
  }

  store(payload: any): Observable<any> {
    return of(null).pipe(
      switchMap(() => payload.id ? this.http.put<any>(`${this.prefix}/${payload.id}`, payload) : this.http.post<any>(`${this.prefix}`, payload))
    );
  }

  delete(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.prefix}/${id}`);
  }

  download(id: string | number): void {
    this.http.get(`${this.prefix}/export/${id}?format=excel`, {
      responseType: 'blob'
    }).subscribe(blob => {
      fileSaver.saveAs(blob);
    });
  }
}

import { Injectable } from '@angular/core';
import { Observable, finalize, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  private prefix: string = "vulnerability_evaluations";
  private _movements: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  get movements$(): Observable<any[]> {
    return this._movements.asObservable();
  }

  list(paginator: MatPagination): void {
    paginator.isLoading = true;
    this.http.get(`${this.prefix}?with=farm;responsible;farm_type;building;location_image`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._movements.next(response.data)
      })
  }

  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=files;farm;farm_type;building;responsible;enviroment_report;hazardous_materials;space_distributions;potential_events;observations;risks`)
      .pipe(map((response: any) => response));
  }

  store(data: any): Observable<any> {
    if (data.id)
      return this.http.put(`vulnerability_evaluations/${data.id}`, data);
    return this.http.post(`vulnerability_evaluations`, data);
  }

  delete(id: string) {
    return this.http.delete(`vulnerability_evaluations/${id}`);
  }

  download(id: number): void {
    this.http.get(`vulnerability-evaluations/${id}/pdf`, { responseType: 'blob' })
      .subscribe((response: Blob) => {
        const dialogRef = this.dialog.open(PdfViewerComponent, {
          width: '90vw',
          height: '90vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          panelClass: 'pdf-dialog',
          autoFocus: false,
          data: {
            blob: response,
            src: window.URL.createObjectURL(response)
          }
        });
      });
  }

  downloadReport(farmId: number, year: number): Observable<any> {
    return this.http.get(`reports/result_summary`, {
      params: { farm_id: farmId.toString(), year: year.toString() },
      responseType: 'blob'
    }).pipe(
      map((response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_resumen_${year}_granja_${farmId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        return response;
      })
    );
  }

  getEvaluationData(id: number): Observable<any> {
    return this.http.get(`instruments/${id}`);
  }

  getFarms(): Observable<any[]> {
    return this.http.get<any>('farms').pipe(map((r: any) => r.data || r));
  }

  getResponsibles(): Observable<any[]> {
    return this.http.get<any>('users').pipe(map((r: any) => r.data || r));
  }

  getWorkSchedules(): Observable<any[]> {
    return this.http.get<any>('areas/work_schedules').pipe(map((r: any) => r.data || r));
  }

  getAreas(): Observable<any[]> {
    return this.http.get<any>('farms/areas?area_type_id=89').pipe(map((r: any) => r.data || r));
  }

  getPotentialEventTypes(): Observable<any[]> {
    return this.http.get<any>('vulnerability_evaluations/potential_event_types').pipe(map((r: any) => r.data || r));
  }

  getPotentialEventClassifications(): Observable<any[]> {
    return this.http.get<any>('vulnerability_evaluations/potential_event_classifications').pipe(map((r: any) => r.data || r));
  }
}

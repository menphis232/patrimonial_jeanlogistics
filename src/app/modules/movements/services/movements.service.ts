import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';
@Injectable({
  providedIn: 'root'
})
export class MovementsService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "vulnerability_evaluations";

  /**
   * Data Behaviour
   */
  private _movements: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private http: HttpClient,
    public dialog: MatDialog
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get movements$(): Observable<any[]> {
    return this._movements.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


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
          return this.http.put(`inventories/stock_movements/${data.id}`, data);

        return this.http.post(`inventories/stock_movements`, data);

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
    return this.http.delete(`inventories/stock_movements/${id}`);
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

  /**
   * Descargar reporte de resumen por granja y año
   * 
   * @param farmId ID de la granja
   * @param year Año para el reporte
   * @returns Observable del reporte
   */
  downloadReport(farmId: number, year: number): Observable<any> {
    return this.http.get(`reports/result_summary`, {
      params: {
        farm_id: farmId.toString(),
        year: year.toString()
      },
      responseType: 'blob'
    }).pipe(
      map((response: Blob) => {
        // Crear un enlace para descargar el archivo
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
}

import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PdfViewerComponent } from '../../../shared/pdf-viewer/pdf-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class ToursService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "safety_tours";

  /**
   * Data Behaviour
   */
  private _tours: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for tours
   */
  get tours$(): Observable<any[]> {
    return this._tours.asObservable();
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
        paginator.update(response);
        this._tours.next(response.data);
      });
  }

  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=safety_tour_details.quesses;safety_tour_details.files;photo;security_guard`)
      .pipe(
        map((response: any) => response)
      );
  }

  store(data: any): Observable<any> {
    return of(null).pipe(
      switchMap(() => {
        if (data.id)
          return this.http.put(`${this.prefix}/${data.id}`, data);
        return this.http.post(`${this.prefix}`, data);
      }),
    );
  }

  delete(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  download(id: number): void {
    this.http.get(`${this.prefix}/export/${id}?type=food`, { responseType: 'blob' })
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
}
import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { PdfViewerComponent } from 'src/app/shared/pdf-viewer/pdf-viewer.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {

  /**
   * Data Behaviour
   */
  private _actions: BehaviorSubject<any[]> = new BehaviorSubject([]);


  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get actions$(): Observable<any[]> {
    return this._actions.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------


  list(paginator: MatPagination): void {

    paginator.isLoading = true;

    this.http.get(`medical_consultations/investigations/responsibles_report`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._actions.next(response.data)
      })

  }

  listGeneralActions(paginator: MatPagination): void {

    paginator.isLoading = true;

    this.http.get(`medical_consultations/investigations/actions?with=responsible`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._actions.next(response.data)
      })

  }




  aprove(data: any): Observable<any> {

          return this.http.put(`medical_consultations/investigations/actions/finalize/${data}`, data);


  }

  reject(data: any): Observable<any> {

    return this.http.put(`medical_consultations/investigations/actions/reject/${data}`, data);


}

download(since,until): void {
  this.http.get(`medical_consultations/investigations/actions?format=pdf&since=${since}&until=${until}`, { responseType: 'blob' })
    .subscribe((response: Blob) => {
      // this.saveFile(response, `export${id}.pdf`);

      const dialogRef = this.dialog.open(PdfViewerComponent, {
        width: '800px', // Adjust width as needed
        height: '800px', // Adjust height as needed
        panelClass: 'center-dialog',
        data: {
          blob: response,
          src:URL.createObjectURL(response)
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
      
      });
    });
}
show(id: string) {
  return this.http.get(`medical_consultations/investigations/actions/${id}`)
    .pipe(
      map((response: any) => response)
    );
}

}

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
export class ProtectionService {

  /**
   * Prefix endpoint
   */
  private prefix: string = "protection_evaluations";

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

    this.http.get(`${this.prefix}?with=farm`, { params: paginator.httpParams() })
      .pipe(
        finalize(() => paginator.isLoading = false)
      )
      .subscribe((response: PaginateResponseType) => {
        paginator.update(response)
        this._movements.next(response.data)
      })

  }


  show(id: string) {
    return this.http.get(`inventories/stock_movements/${id}`)
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
    return this.http.delete(`${this.prefix}/${id}`);
  }

  // download(id: number): void {
  //   this.http.get(`${this.prefix}/pdf/${id}`, { responseType: 'blob' })
  //     .subscribe((response: Blob) => {
  //       // this.saveFile(response, `export${id}.pdf`);

  //       const dialogRef = this.dialog.open(PdfViewerComponent, {
  //         width: '100%',
  //         data: {
  //           blob: response,
  //           src:URL.createObjectURL(response)
  //         },
  //       });
  //       dialogRef.afterClosed().subscribe((result) => {
        
  //       });
  //     });
  // }

  download(id: number): void {
    this.http.get(`protection_evaluations/export/${id}`, { responseType: 'blob' })
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

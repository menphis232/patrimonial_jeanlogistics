import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OfficeSelectService {
  
  private _costCenterType$: BehaviorSubject<any | null> = new BehaviorSubject(null);
  private _costCenter$: BehaviorSubject<any | null> = new BehaviorSubject(null);

  setOfficeStorage(office: any, keyStorage: string) {
    localStorage.setItem(keyStorage, JSON.stringify(office));
  }

  getOfficeStorage(keyStorage: string): any {
    return JSON.parse(localStorage.getItem(keyStorage)) ?? {};
  }
   
  get costCenterType$(): Observable<any | null> {
    return this._costCenterType$.asObservable();
  }

  get costCenter$(): Observable<any | null> {
    return this._costCenter$.asObservable();
  }

  constructor(
    private toast: ToastrService,
    private http: HttpClient
  ) { }

  /**
   * Obtiene los tipos de centros de costo desde el endpoint farms/types
   */
  getFarmTypes(): Observable<any[]> {
    return this.http.get<any[]>('farms/types').pipe(
      map((response: any) => response.data || response)
    );
  }

  selectCostCenterType(cosCenterType: any) {
    
    const currentSelectedBranch = this._costCenterType$.getValue();

    if (currentSelectedBranch?.id === cosCenterType?.id) {
      return;
    }

    this._costCenterType$.next(cosCenterType);
  }

  selectCostCenter(costCenter: any) {
    this._costCenter$.next(costCenter);
  }

  selectGlobalOption() {
    // Limpia las selecciones actuales
    this._costCenterType$.next(null);
    this._costCenter$.next(null);
    localStorage.removeItem('costCenterType');
    localStorage.removeItem('costCenter');
    this.setGlobalSelected(true);
  }

  isGlobalSelected(): boolean {
    return localStorage.getItem('isGlobalSelected') === 'true';
  }

  setGlobalSelected(isGlobal: boolean): void {
    localStorage.setItem('isGlobalSelected', isGlobal.toString());
  }
}

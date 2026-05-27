import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
   * Prefix endpoint
   */
  private prefix: string = `${environment.apiUrl.replace(/\/$/, '')}/reports`;

  /**
   * Data Behaviour
   */
  private _collaborators: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for collaborators
   */
  get collaborators$(): Observable<any[]> {
    return this._collaborators.asObservable();
  }

  /**
   * Helper to safely fetch cost center from storage
   */
  getCostCenterFromStorage() {
    try {
      let e = localStorage.getItem("costCenter");
      if (e == null || e === "") return null;
      let i = JSON.parse(e);
      return i && typeof i.id !== "undefined" ? i : null;
    } catch {
      return null;
    }
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
        paginator.update(response)
        this._collaborators.next(response.data)
      });
  }

  accidentPerAreaGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ datasets: [] });
    
    let queryParams = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    queryParams.push("intrument_id=2");
    queryParams.push(`farm_id[]=${i.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    console.log('URL de accidentPerAreaGraph:', `${this.prefix}/place_incidences${queryString}`);
    
    return this.http.get(`${this.prefix}/place_incidences${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en accidentPerAreaGraph:', error);
        return of({ datasets: [] });
      })
    );
  }

  accidentPerYearGraph(params?): Observable<any> {
    return this.http.get(`${this.prefix}/accidents_per_year`, {
      params,
    });
  }

  accidentPerCenterCost(params?): Observable<any> {
    return this.http.get(`${this.prefix}/accidents_per_cost_center`, {
      params,
    });
  }

  consultMedicalPerAreaGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ datasets: [] });
    return this.http.get(`${this.prefix}/evaluations_risk_per_farms?type=food&farm_id[]=${i.id}`, {
      params,
    });
  }

  consultMedicalPerReasonGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ datasets: [] });
    
    let queryParams = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    queryParams.push(`farm_id[]=${i.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/lost_incidences${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en consultMedicalPerReasonGraph:', error);
        return of({ datasets: [] });
      })
    );
  }

  incidentPerAreaGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ datasets: [] });
    
    let queryParams = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    queryParams.push(`farm_id[]=${i.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_per_farm${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidentPerAreaGraph:', error);
        return of({ datasets: [] });
      })
    );
  }

  typeIncapacitiesAreaGraph(params?): Observable<any> {
    return this.http.get(`${this.prefix}/incapacities_per_types`, {
      params,
    });
  }

  incapacitiesPerYearGraph(params?): Observable<any> {
    return this.http.get(`${this.prefix}/incapacities_per_year`, {
      params,
    });
  }
  
  show(id: string) {
    return this.http.get(`${this.prefix}/${id}?with=cost_center`)
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
    )
  }

  delete(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  download(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  getVulnerabilityEvaluations(params: any): Observable<any> {
    const filteredParams = {};
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== 'null') {
          filteredParams[key] = params[key];
        }
      });
    }
    console.log('Parámetros filtrados para API:', filteredParams);
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_vulnerability_evaluations`, { 
      params: filteredParams 
    }).pipe(
      catchError(error => {
        console.error('Error en la petición de evaluación de vulnerabilidad:', error);
        return of([]);
      })
    );
  }

  getVulnerabilityPoints(params: any): Observable<any> {
    let filteredParams = this.filterParams(params);
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_vulnerability_points`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getVulnerabilityPoints:", error);
        return of([]);
      })
    );
  }

  getVulnerabilityPointsByRiskLevel(params?: any): Observable<any> {
    let filteredParams = this.filterParams(params || {});
    console.log("graph_vulnerability_points_by_risk_level params:", filteredParams);
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_vulnerability_points_by_risk_level`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getVulnerabilityPointsByRiskLevel:", error);
        return of({ by_risk_level: [] });
      })
    );
  }

  getVulnerabilityPointsByStatus(params?: any): Observable<any> {
    let filteredParams = this.filterParams(params || {});
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_vulnerability_points_by_status`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getVulnerabilityPointsByStatus:", error);
        return of({ total: 0, by_status: [] });
      })
    );
  }

  getVulnerabilityPointsByArea(params?: any): Observable<any> {
    let filteredParams = this.filterParams(params || {});
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_vulnerability_points_by_area`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getVulnerabilityPointsByArea:", error);
        return of({ by_area: [] });
      })
    );
  }

  getHallazgosPorPlanta(params: any): Observable<any> {
    let filteredParams = {
      since: params.since,
      until: params.until,
      _t: Date.now().toString()
    };
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_hallazgos_por_planta`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getHallazgosPorPlanta:", error);
        return of({ risk_level_summary: { total: 0, by_level: [] }, chart: { categories: [], series: [] } });
      })
    );
  }

  getIncidenciasPorPlanta(params: any): Observable<any> {
    let filteredParams = {
      since: params.since,
      until: params.until,
      _t: Date.now().toString()
    };
    return this.http.get<any>(`${environment.apiUrl}/dashboard/graph_incidencias_por_planta`, {
      params: filteredParams,
      headers: { skipOffices: "true" }
    }).pipe(
      catchError(error => {
        console.error("Error en getIncidenciasPorPlanta:", error);
        return of({ type_labels: [], plant_categories: [], by_plant: [], totals_global_by_type: [] });
      })
    );
  }

  filterParams(params: any): any {
    let i: any = {};
    try {
      let a = localStorage.getItem("costCenterType");
      if (a) {
        let s = JSON.parse(a);
        if (s?.id != null) {
          i.farm_type_id = s.id;
        }
      }
      let r = localStorage.getItem("costCenter");
      if (r) {
        let s = JSON.parse(r);
        if (s?.farm_type_id != null) {
          i.farm_type_id = s.farm_type_id;
        }
        let n = s?.id ?? s?.farm_id;
        if (n != null && n !== "") {
          i.farm_id = n;
        }
      }
    } catch (error) {}
    
    if (params && typeof params === "object") {
      Object.keys(params).forEach(a => {
        if (params[a] !== null && params[a] !== undefined && params[a] !== "") {
          i[a] = params[a];
        }
      });
    }
    return i;
  }

  incidencesByTypeGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ labels: [], datasets: [{ label: "Incidencias por tipo", data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
    
    let queryParams = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    queryParams.push(`farm_id[]=${i.id}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_by_type${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidencesByTypeGraph:', error);
        return of({ labels: [], datasets: [{ label: "Incidencias por tipo", data: [], backgroundColor: [], hoverBackgroundColor: [] }] });
      })
    );
  }

  incidencesPerHourGraph(params?): Observable<any> {
    let i = this.getCostCenterFromStorage();
    if (!i?.id) return of({ 
      labels: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"], 
      datasets: [{ label: "Incidencias por hora", data: new Array(24).fill(0) }] 
    });
    
    let queryParams = [];
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    queryParams.push(`farm_id[]=${i.id}`);
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_per_hour${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidencesPerHourGraph:', error);
        return of({ 
          labels: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"], 
          datasets: [{ label: "Incidencias por hora", data: new Array(24).fill(0) }] 
        });
      })
    );
  }
}

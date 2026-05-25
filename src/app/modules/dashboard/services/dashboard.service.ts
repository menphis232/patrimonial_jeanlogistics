import { Injectable } from '@angular/core';
import { Observable, finalize, switchMap, of, map, BehaviorSubject, catchError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { PaginateResponseType } from 'src/app/shared/mat-pagination/interfaces/paginate-response.interface';
import { format } from 'date-fns';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  /**
     * Prefix endpoint
     */
  private prefix: string = "reports";

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
      })

  }

  accidentPerAreaGraph(params?): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar parámetros fijos
    queryParams.push(`intrument_id=2`);
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    console.log('URL de accidentPerAreaGraph:', `${this.prefix}/place_incidences${queryString}`);
    
    return this.http.get(`${this.prefix}/place_incidences${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en accidentPerAreaGraph:', error);
        return of({ datasets: [] }); // Devolver datos vacíos para no bloquear otros gráficos
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
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    return this.http.get(`${this.prefix}/evaluations_risk_per_farms?type=food&farm_id[]=${farm.id}`, {
      params,
    });
  }
  consultMedicalPerReasonGraph(params?): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar farm_id[] sin encoding de los corchetes
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/lost_incidences${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en consultMedicalPerReasonGraph:', error);
        return of({ datasets: [] }); // Devolver datos vacíos para no bloquear otros gráficos
      })
    );
  }
  incidentPerAreaGraph(params?): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar farm_id[] sin encoding de los corchetes
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_per_farm${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidentPerAreaGraph:', error);
        return of({ datasets: [] }); // Devolver datos vacíos para no bloquear otros gráficos
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
          return this.http.put(`${this.prefix}/${data.id}`, data);

        return this.http.post(`${this.prefix}`, data);

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

   /**
   * Descargar archivo
   * 
   * @param {number} id 
   * @returns 
   */
   download(id: string) {
    return this.http.delete(`${this.prefix}/${id}`);
  }

  /**
   * Obtiene los datos para el gráfico de evaluación de vulnerabilidad
   * @param params Parámetros de filtrado
   * @returns Observable con los datos del gráfico
   */
  getVulnerabilityEvaluations(params: any): Observable<any> {
    // Filtrar parámetros nulos o indefinidos
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

  /**
   * Obtiene los datos para el gráfico de puntos de vulnerabilidad
   * @param params Parámetros de filtrado
   * @returns Observable con los datos del gráfico
   */
  getVulnerabilityPoints(params: any): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar farm_id[] sin encoding de los corchetes
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/vulnerability_points${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en getVulnerabilityPoints:', error);
        return of([]); // Devolver datos vacíos para no bloquear otros gráficos
      })
    );
  }

  /**
   * Obtiene los datos para el gráfico de incidencias por tipo
   * @param params Parámetros de filtro (fechas, etc.)
   * @returns Observable con los datos del gráfico
   */
  incidencesByTypeGraph(params?): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar farm_id[] sin encoding de los corchetes
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_by_type${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidencesByTypeGraph:', error);
        return of({ labels: [], datasets: [{ label: "Incidencias por tipo", data: [], backgroundColor: [], hoverBackgroundColor: [] }] }); // Devolver datos vacíos para no bloquear otros gráficos
      })
    );
  }

  /**
   * Obtiene los datos para el gráfico de incidencias por hora
   * @param params Parámetros de filtro (fechas, etc.)
   * @returns Observable con los datos del gráfico
   */
  incidencesPerHourGraph(params?): Observable<any> {
    let farm = JSON.parse(localStorage.getItem('costCenter'))
    
    // Construir query string manualmente para evitar encoding de []
    let queryParams = [];
    
    // Agregar parámetros adicionales si existen
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          queryParams.push(`${key}=${encodeURIComponent(params[key])}`);
        }
      });
    }
    
    // Agregar farm_id[] sin encoding de los corchetes
    queryParams.push(`farm_id[]=${farm.id}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    return this.http.get(`${this.prefix}/incidences_per_hour${queryString}`, {
      headers: { 'skipOffices': 'true' }
    }).pipe(
      catchError(error => {
        console.error('Error en incidencesPerHourGraph:', error);
        return of({ 
          labels: ["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"], 
          datasets: [{ label: "Incidencias por hora", data: new Array(24).fill(0) }] 
        }); // Devolver datos vacíos para no bloquear otros gráficos
      })
    );
  }

}


import { Injectable } from '@angular/core';
import { IParamsCSelect, IQueryParam } from './c-select.interface';
import { HttpClient } from '@angular/common/http';
import { MatPagination } from '../mat-pagination/models/mat-pagination';
import { IResponse } from '../interfaces/response.interface';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
/**  
* Servicio que lista todos los métodos que se pueden consultar por medio del componente select. Todos son listados para montar las opciones
*/
export class CSelectService {

  private paginator = new MatPagination

  constructor(
    private http: HttpClient
  ) {
    this.paginator.perPage = 50;
  }

  /**
 * Mapea los queryParams que se han configurado para filtrar
 */
  processParams(params: IQueryParam[]) {
    if (!params) return {}

    return params.reduce(
      (obj, item) => Object.assign(obj, { [item.param]: item.value }), {}
    )
  }

  /**
   * example(params: IParamsCSelect): Observable<any[]> {
   *    this.paginator.search = params.search;
   *    this.paginator.params = this.processParams(params.params)
   *
   *    return <Observable<any[]>>this.http.get("example", {
   *       params: this.paginator.httpParams()
   *    }).pipe(
   *      map((item: IResponse) => item.data)
   *    );
   * }
   */

  typeBlood(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("blood_types", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item:any) => item)

    );
  }
  turn(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("turns", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  workSpace(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("work_spaces", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  activePrinciples(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/active_principles", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  categories(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/article_categories", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  brands(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/article_brands", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  measurementUnits(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/measurement_units", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  stockMovementConcepts(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/stock_movement_concepts", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  stocks(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("inventories/stocks", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => {

        return item.data.map((stock) => {
          return {
            ...stock,
            description_stock: `${stock.article.name}-${stock.article.code}`
            
          }
        })
      })
    );
  }

  costCenters(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"farms/getAll?type=farm", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }
  statusCamera(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"inventory_cameras/status_cameras", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }
  accessCamera(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"inventory_cameras/access_cameras", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }
  workSchedule(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"farms/areas/work_schedules", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  areaTypes(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"catalogs?name=farm_area_types&table_name=farm_areas", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => {
        // Si la respuesta es directamente un array, lo retornamos tal como está
        if (Array.isArray(item)) {
          return item;
        }
        // Si tiene estructura de respuesta con data, retornamos item.data
        return item.data || item;
      })
    );
  }
  areas(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get(environment.loginUrl+"farms/areas", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  areaCostCenters(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("cost_center_areas", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  typeCostCenters(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("farms/types", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }
  buildType(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("farms/building_types", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  users(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("users", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  farmActivities(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("farms/activities", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }
  
  
  // typeCostCenters(params: IParamsCSelect) {
  //   this.paginator.search = params.search;

  //   return of([
  //     {
  //       id: 1,
  //       name: 'Plantas',
  //       code: 'foods',
  //     }
  //   ])
  // }

  roles(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("roles", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item.data)
    );
  }

  general(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("catalog_exams?name=general_1", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  positivenegative(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("catalog_exams?name=positive_negative", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  espirometria(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("catalog_exams?name=qs_spirometry", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  hipoacusia(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("catalog_exams?name=hipoacusia", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  capimetria(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("catalog_exams?name=capimetria", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  risk(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/risks", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  place(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/places", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  typeCare(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/type_cares", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  time(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/time_types", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  evaluationAccident(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/evaluations", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  evaluationRisk(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/risk_classifications", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  
  cause(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/medical_event_causes", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  injuryType(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/injury_types", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  affectParts(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/events/body_parts", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  affectPartsSite(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;
    this.paginator.params = this.processParams(params.params)
    // this.paginator.body_part_id = params.body_part_id;

    return this.http.get("medical_consultations/events/body_part_details", {
       params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item.data)
    );
  }

  

  patients(params: IParamsCSelect): Observable<any[]> {
  this.paginator.search = params.search;

  return this.http.get("employees?with=turn;work_space;blood_type;cost_center;cost_center_area", {
    // params: this.paginator.httpParams() // Optional, uncomment if needed
  }).pipe(
    map((item: any) => {
      // Ensure data is an array before modification
      const data = Array.isArray(item.data) ? item.data : [];

      return data.map((patient) => {
        // Concatenate first_name and last_name with a space in between
        patient.nameComplete = `${patient.first_name || ''} ${patient.last_name || ''}`;
        return patient;
      });
    })
  );
}

  responsibles(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/investigations/actions/responsibles", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  reasonConsultations(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/reason_consultations", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  
  incapacitiesTypes(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/incapacity_types", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item)
    );
  }
  incapacitiesClassification(params: IParamsCSelect) {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/incapacities/classifications", {
      params: this.paginator.httpParams()
    }).pipe(
      map((item: IResponse) => item)
    );
  }
  humanBody(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/human_body_systems", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  inmediateCause(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/investigations/immediate_causes", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  basicCause(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/investigations/basic_causes", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  employee(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("employees", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }
  
  reasonConsultation(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/reason_consultations", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  
  categoryChangeOperation(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("medical_consultations/operation_change_categories", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  typeTransaction(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("inventary/transactions_types", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  turns(params: IParamsCSelect): Observable<any[]> {
    this.paginator.search = params.search;

    return this.http.get("security_guards/turns", {
      // params: this.paginator.httpParams()
    }).pipe(
      map((item: any) => item)
    );
  }

  

}
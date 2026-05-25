import { HttpParams } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map, merge, of } from 'rxjs';
import { PaginateResponseType } from "../interfaces/paginate-response.interface";

export class MatPagination {

    /**
     * Emite cambios generales en la paginación
     */
    changeValues$: Subject<any> = new Subject()
    
    /**
     * Data obtenida desde el servicio
     */
    data$: Observable<any[]> = of([])

    /**
     * Props pagination
     */
    search: string = '';

    perPage: number = 6;

    page: number = 1;

    total: number = 0;
    
    sortedBy: string = 'desc';
    
    orderBy: string = 'id';

    meta: any = {}
    
    /**
     * QueryParams
     */
    params = {};

    /**
     * Loading status
     */
    isLoading: boolean = false;

    /**
     * Cantidad de peticiones de paginacion realizadas 
     */
    rates: number = 0

    
    /**
     * Index utilizado por estandares de paginación de angular
     */
    get pageIndex(): number {
        return this.page - 1;
    }

    /**
     * Mapear solo las propiedades de paginación
     */
    get values(): any {
        return {
            ...this.params,
            search: this.search,
            per_page: this.perPage,
            page: this.pageIndex,
            total: this.total,
            sortedBy: this.sortedBy,
            orderBy: this.orderBy,
            meta: this.meta
        }
    }

    /**
     * Escucha por medio de la API de elementos de paginación de Angular Material
     * los cambios ocurridos en la UI 
     * 
     * @param {array} elements ViewQuery de elementos de paginación de Mat
     */
    listenPageChanges(elements: any[]){
        merge(...elements).subscribe((values: any) => {
            // case sort
            if(values?.active && values?.direction){
                this.orderBy  = values.active
                this.sortedBy = values.direction
            }

            // case change page
            if(values?.pageIndex >= 0 && values?.pageSize >= 0){
                this.perPage = values.pageSize
                this.page    = values.pageIndex + 1
            }
            
            this.next()
        })
    }

    /**
     * Emitir evento de nuevo cambio
     */
     next(){
        this.changeValues$.next(0)
    }

    /**
     * Actualiza la clase con el response del servicio
     * 
     * @param response Respuesta HTTP de servicio de paginación
     */
    update(response: PaginateResponseType){
        this.rates += 1 
        this.total = response.total || 0
        this.page = response.current_page || 1
        this.perPage = parseInt(response.per_page) || 6
        this.data$ = of(response.data || [])
        this.meta = {
            from: response.from,
            to: response.to,
            last_page: response.last_page
        }
    }

    /**
     * Asignar valores de busqueda
     * 
     * @param {string} term Termino de busqueda
     */
     setSearch(term: string){
        this.page    = 1;
        this.search  = term;
        this.next()
    }

    setParams(params: any){
        this.page   = 1;
        this.params = { ...this.params, ...params, }
        this.next()
    }

    /**
     * Devuelve objeto de parametros utilizados por el HttpClient
     */
    httpParams(): HttpParams {
        let queryParams = new HttpParams;

        queryParams = queryParams.append("page", this.page);
        queryParams = queryParams.append("per_page", this.perPage);
        queryParams = queryParams.append("search", this.search);
        queryParams = queryParams.append("sortedBy", this.sortedBy);
        queryParams = queryParams.append("orderBy", this.orderBy);

        Object.keys(this.params).forEach(key => 
            queryParams = queryParams.append(key, this.params[key])
        )

        return queryParams;
    }

}
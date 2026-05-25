import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take, switchMap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { OfficeSelectService } from 'src/app/layouts/full/horizontal/office-select/office-select.service';

@Injectable()
export class OfficesInterceptor implements HttpInterceptor {

    /**
     * Constructor
     */
    constructor(
        private _officeSelectService: OfficeSelectService
    ) {}
  

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('skipOffices')) {
            return next.handle(req);
        }

        if (req.url.includes('cost_centers')) {
            return next.handle(req);
        }

        if (req.urlWithParams.includes('api')) {
            return this._officeSelectService.costCenter$.pipe(
                take(1),
                switchMap(selected => {
                    // Verificar si está seleccionada la opción global
                    const isGlobal = this._officeSelectService.isGlobalSelected();
                    
                    if (isGlobal) {
                        // Si es global, no agregamos parámetros de farm
                        return next.handle(req);
                    }
                  
                    // Solo agregamos parámetros si no es global
                    const costCenter = this._officeSelectService.getOfficeStorage("costCenter");
                    const costCenterType = this._officeSelectService.getOfficeStorage("costCenterType");
                    const modifiedReq = this.addBranchIdQueryParam(req, { costCenter, costCenterType });

                    return next.handle(modifiedReq);
                })
            );
        }

        return next.handle(req);
    }

    private addBranchIdQueryParam(req: HttpRequest<any>, { costCenter, costCenterType }): HttpRequest<any> {
        let params = new HttpParams({ fromString: req.params.toString() });

        // Agregamos los parámetros farm_id y farm_type_id solo cuando NO es global
        if (costCenter && costCenter.id) {
            params = params.set('farm_id', costCenter.id);
        }
        
        if (costCenterType && costCenterType.id) {
            params = params.set('farm_type_id', costCenterType.id);
        }

        return req.clone({
            params: params
        });
    }
}

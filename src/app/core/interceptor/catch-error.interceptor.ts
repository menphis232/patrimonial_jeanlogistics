import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()

export class CatchErrorsInterceptor implements HttpInterceptor {

    constructor(
        public route: Router,
        private toast: ToastrService
    ) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // this.toast.error("Ha ocurrido un error en el servidor. Contactar con Soporte. Error: ")
        /**
         * Si hay alguna peticion que quiera no manejar este catch de errores, se envía por cabecera
         * skip para omitr
         */
        if (req.headers.get('skip')) {
            return next.handle(req);
        }

        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => { },
                (err: any) => {
                    
                    if (err instanceof HttpErrorResponse) {

                        switch (err.status) {
                            case 500:
                                this.toast.error("Ha ocurrido un error en el servidor. Contactar con Soporte. Error: " + JSON.stringify(err.error))
                                break;
                            case 404:
                                this.toast.error("Recurso no encontrado")
                                break;
                            case 422:
                                console.log(err.error)
                                if(err.error){
                                    this.toast.error(err.error.message)
                                }else{
                                    const keys = Object.keys(err.error.errors)
                                    this.toast.error(err.error.errors[keys[0]][0])
                                }
                             
                                break;
                            case 429:
                                this.toast.error("Su red ha realizado demasiadas peticiones al servidor. Espere unos segundos")
                                break;
                            case 401:
                                this.toast.error(err.error.message)
                                break;
                            case 403:
                                this.toast.error(err.error.message)
                                break;
                        }

                    }
                }
            )
        )
    }

}

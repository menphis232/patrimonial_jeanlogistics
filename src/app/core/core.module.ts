import { NgModule, Optional, SkipSelf } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiInterceptor } from './interceptor/api.interceptor';
import { CatchErrorsInterceptor } from './interceptor/catch-error.interceptor';
import { AuthModule } from './auth/auth.module';
import { OfficesInterceptor } from './interceptor/offices.interceptor';

@NgModule({
    imports: [
        AuthModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: OfficesInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CatchErrorsInterceptor,
            multi: true 
        }

    ],
})
export class CoreModule
{
    /**
     * Constructor
     */
    constructor(
        @Optional() @SkipSelf() parentModule?: CoreModule
    )
    {
        // Do not allow multiple injections
        if ( parentModule )
        {
            throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
        }
    }
}

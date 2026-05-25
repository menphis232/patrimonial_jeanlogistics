import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { AuthService } from "../auth.service";



export const noAuthGuard: CanActivateFn = (route, state) => {
    return _check();
}

export const noAuthGuardChild: CanActivateChildFn = (route, state) => {
    return _check();
}

/**
* Check the authenticated status
*
* @private
*/
const _check = () => {
    const _router = inject(Router)
    const _authService = inject(AuthService)

    // Check the authentication status
    return _authService.check()
        .pipe(
            switchMap((authenticated) => {

                // If the user is authenticated...
                if (authenticated) {
                    // Redirect to the root
                    _router.navigate(['']);

                    // Prevent the access
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
        );
}
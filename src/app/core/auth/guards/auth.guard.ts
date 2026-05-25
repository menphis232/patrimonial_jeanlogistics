import { inject } from "@angular/core";
import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { AuthService } from "../auth.service";



export const authGuard: CanActivateFn = (route, state) => {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return _check(redirectUrl);
}

export const authGuardChild: CanActivateChildFn = (route, state) => {
    const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
    return _check(redirectUrl);
}

/**
* Check the authenticated status
*
* @private
*/
const _check = (redirectURL: string) => {
    const _router = inject(Router)
    const _authService = inject(AuthService)

    // Check the authentication status
    return _authService.check()
        .pipe(
            switchMap((authenticated) => {

                // If the user is not authenticated...
                if (!authenticated) {
                    // Redirect to the sign-in page
                    _router.navigate(['sign-in'], { queryParams: { redirectURL } });

                    // Prevent the access
                    return of(false);
                }

                // Allow the access
                return of(true);
            })
        );
}
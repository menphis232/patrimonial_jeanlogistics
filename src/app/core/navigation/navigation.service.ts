import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { ROUTES_NAVIGATION } from './navigation-routes.config';
import { UserService } from '../user/user.service';
import { Navigation } from './navigation.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{

    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        // const NAVIGATION_ROUTES_FINALLY = this._userService.applyPermissionsToNavigation(ROUTES_NAVIGATION)

        return of({
            default: ROUTES_NAVIGATION
        }).pipe(
            tap((data) => this._navigation.next(data))
        );
    }
}

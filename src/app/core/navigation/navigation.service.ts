import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import { ROUTES_NAVIGATION } from './navigation-routes.config';
import { UserService } from '../user/user.service';
import { Navigation } from './navigation.types';
import { VulnerabilityPointWorkflowService } from '../../modules/vulnerability-point/services/vulnerability-point-workflow.service';

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
        private _userService: UserService,
        private _workflowService: VulnerabilityPointWorkflowService
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
        
        let finalRoutes = ROUTES_NAVIGATION;
        if (this._workflowService.isCaptureL2L3()) {
            finalRoutes = ROUTES_NAVIGATION.filter(route => 
                route.displayName === 'Recorrido de seguridad' || 
                route.displayName === 'Puntos de vulnerabilidad' ||
                route.displayName === 'Dashboard' ||
                route.navCap === 'APPS'
            );
        }

        return of({
            default: finalRoutes
        }).pipe(
            tap((data) => this._navigation.next(data))
        );
    }
}

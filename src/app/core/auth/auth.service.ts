import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { User } from '../user/user.types';
import { UserService } from '../user/user.service';
import {environment} from './../../../environments/environment'

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(id: any, data: any, farmId?: any, farmTypeId?: any): Observable<any> {
        let url = `${environment.apiUrl}/vulnerability-points/corrective_actions/${id}/email-opened`;
        const params: string[] = [];
        if (farmId) params.push(`farm_id=${farmId}`);
        if (farmTypeId) params.push(`farm_type_id=${farmTypeId}`);
        if (params.length) url += '?' + params.join('&');
        return this._httpClient.get(url);
    }
    signIn2(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(environment.loginUrl+'auth/login', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;
     
                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Refresh user
     */
    refreshUserUsingToken(): Observable<any>
    {
        // Renew token
        return this._userService.get().pipe(
            catchError(() =>                
                // Return false
                of(false)
            ),
            switchMap((user: User) => {
                // Set the authenticated flag to true
                this._authenticated = true;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        // localStorage.removeItem('accessToken');

        localStorage.clear()

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }


    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

     /**
     * Check the authentication status
     */
    check(): Observable<boolean> {

        // Check if the user is logged in
        if (this.accessToken) {

            this._authenticated = true;

            // Si el BehaviorSubject del usuario está vacío, recargarlo desde la API
            // para que los roles queden disponibles en memoria
            if (!this._userService['_user']?.getValue?.()?.id) {
                return this.refreshUserUsingToken();
            }

            return of(true);
        }

        this._authenticated = false;

        return of(false);

    }

    /**
     * Check the authentication status
     */
    // check(): Observable<boolean>
    // {

    //     console.log(this.accessToken);
        
    //     // Check if the user is logged in
    //     if ( this._authenticated )
    //     {
    //         return of(true);
    //     }

    //     // Check the access token availability
    //     if ( !this.accessToken )
    //     {
    //         return of(false);
    //     }
        
    //     // If the access token exists and it didn't expire, sign in using it
    //     return this.refreshUserUsingToken();
    // }

    show(id: string, farmId?: any, farmTypeId?: any) {
        let url = `${environment.apiUrl}/vulnerability-points/corrective_actions/${id}?with=evidences`;
        if (farmId) url += `&farm_id=${farmId}`;
        if (farmTypeId) url += `&farm_type_id=${farmTypeId}`;
        return this._httpClient.get(url)
          .pipe(
            map((response: any) => response)
          );
    }

    completeAction(id: any, data: any, farmId?: any, farmTypeId?: any): Observable<any> {
        let url = `${environment.apiUrl}/vulnerability-points/corrective_actions/complete/${id}`;
        const params: string[] = [];
        if (farmId) params.push(`farm_id=${farmId}`);
        if (farmTypeId) params.push(`farm_type_id=${farmTypeId}`);
        if (params.length) url += '?' + params.join('&');
        return this._httpClient.put(url, data);
    }
}

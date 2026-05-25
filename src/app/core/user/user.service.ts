import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, UserProfile } from './user.types';
import { cloneDeep } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User)
    {
        // Store the value
        localStorage.setItem('user', JSON.stringify(value))
        this._user.next(value);
    }

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    get roles(): string[] {
        const roles = this._user.getValue()?.roles
    
        if(Array.isArray(roles)){
          return roles.map(item => item?.name)
        }
        return [];
    }

    get permissions(): string[] {
        const roles = this._user.getValue()?.roles
    
        if(Array.isArray(roles)){
          return roles.flatMap(item => item?.permissions).map(item => item?.name)
        }
        return [];
    }

    get userStorage(): any
    {
        return localStorage.getItem('user') ?? '';
    }
  
    

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User>
    {
        return this._httpClient.get<User>('auth/user').pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update preferences user
     *
     * @param user
     */
    updatePreferences(config: any): void
    {
        this._httpClient.patch<User>('auth/preferences', config).subscribe()
    }

    /**
     * Update user profile
     *
     * @param user
     */
    updateProfile(userProfile: UserProfile | any)
    {
        return this._httpClient.put<any>(`auth/user`, userProfile);
    }

    /**
     * Si tiene los permisos
     * 
     * @param name Permiso
     */
    hasPermissions(names: string[]): boolean{
        return this.permissions.some(permissionName => names.includes(permissionName));
    }

    /**
     * Si tiene el rol
     * 
     * @param name roles
     */
    hasRoles(roles: string[]): boolean{
        return this.roles.some(role => roles.includes(role));
    }

    /**
    * Aplicar los permisos del usuario a las rutas, filtrando aquellas que solo puede ver
    * 
    * @param routes Rutas definidas para la navegacion
    */
    applyPermissionsToNavigation(routes: any[]): any[] {

        let routesClone = cloneDeep(routes);
        
        const copyRoutes = [...routesClone].filter(route => {

            // cualquiera puede acceder si no tiene permisos
            if (route.meta?.permissions?.length == 0 && route.meta?.permissions?.length == 0)
                return true;

            // Se verifica los permisos de la ruta con los del usuario
            const filteredApply = route.meta?.permissions?.filter(routePermission =>
                this.permissions.includes(routePermission)
            ) ?? []

            route.children = route.children ? this.applyPermissionsToNavigation(route.children) : []

            if (filteredApply.length == 0 && route.children.length == 0)
                return false

            if (filteredApply.length == 0 && route.children.length > 0)
                return true;

            return true;
        })

        return copyRoutes
    }
}

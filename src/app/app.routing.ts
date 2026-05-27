import { Route, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { InitialDataResolver } from './app.resolvers';
import { authGuard, authGuardChild } from './core/auth/guards/auth.guard';
import { noAuthGuard, noAuthGuardChild } from './core/auth/guards/noAuth.guard';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Routes = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [noAuthGuard],
        canActivateChild: [noAuthGuardChild],
        component: BlankComponent,
        children: [
            {path: 'sign-in', loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'auth/actions/:id', loadChildren: () => import('./modules/auth/complete-actions/complete-actions.module').then(m => m.CompleteActionsModule)},
        ]
    },
    // Admin routes
    {
        path       : '',
        canActivate: [authGuard],
        canActivateChild: [authGuardChild],
        component  : FullComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            {
                path: 'dashboard',
                loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
            },
            // Recorrido de seguridad - Áreas / Ergonomic
            {
                path: 'ergonomic',
                loadChildren: () => import('./modules/ergonomic/ergonomic.module').then(m => m.ErgonomicModule)
            },
            // Guardias de seguridad y Turnos
            {
                path: 'category',
                loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule)
            },
            // Puntos de vulnerabilidad
            {
                path: 'vulnerability-points',
                loadChildren: () => import('./modules/vulnerability-point/vulnerability-point.module').then(m => m.VulnerabilityPointModule),
                data: {
                    title: 'Puntos de Vulnerabilidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Puntos de Vulnerabilidad' }
                    ]
                }
            },
            // Expedientes
            {
                path: 'expedients',
                loadChildren: () => import('./modules/expedients/expedients.module').then(m => m.ExpedientsModule)
            },
            // Usuarios
            {
                path: 'users',
                loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
            },
            // Categorías de áreas
            {
                path: 'area-categories',
                loadChildren: () => import('./modules/area-category/area-category.module').then(m => m.AreaCategoryModule),
                data: {
                    title: 'Categorías de área',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Admin', url: '/admin' },
                        { title: 'Categorías de área' }
                    ]
                }
            },
            // Incidentes
            {
                path: 'incident',
                loadChildren: () => import('./modules/incident/incident.module').then(m => m.IncidentModule)
            },
            // Responsables
            {
                path: 'responsible',
                loadChildren: () => import('./modules/responsible/responsible.module').then(m => m.ResponsibleModule)
            },
            // Áreas
            {
                path: 'areas',
                loadChildren: () => import('./modules/areas/areas.module').then(m => m.AreasModule)
            },
            // Evaluación de vulnerabilidad
            {
                path: 'movements',
                loadChildren: () => import('./modules/movements/movements.module').then(m => m.MovementsModule)
            },
            // Evaluación de protección
            {
                path: 'protection',
                loadChildren: () => import('./modules/protection/protection.module').then(m => m.ProtectionModule)
            },
            // Inventario general
            {
                path: 'brands',
                loadChildren: () => import('./modules/brands/brands.module').then(m => m.BrandsModule)
            }
        ]
    }
];


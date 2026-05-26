import { Route, Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { BlankComponent } from './layouts/blank/blank.component';
import { InitialDataResolver } from './app.resolvers';
import { ActionDetailComponent } from './modules/auth/pages/action-detail/action-detail.component';

import { authGuard, authGuardChild } from './core/auth/guards/auth.guard';
import { noAuthGuard, noAuthGuardChild } from './core/auth/guards/noAuth.guard';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Routes = [

    // Esta ruta debe ir ANTES de las redirecciones
    {
        path: 'auth/actions/:id',
        component: BlankComponent,
        children: [
            {
                path: '',
                component: ActionDetailComponent,
                data: { public: true } // Marcamos la ruta como pública
            }
        ]
    },

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
            {
                path: 'patient',
                loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule)
            },  
            {
                path: 'general-consultation',
                loadChildren: () => import('./modules/general-consultation/general-consultation.module').then(m => m.GeneralConsultationModule)
            },
            {
                path: 'brands',
                loadChildren: () => import('./modules/brands/brands.module').then(m => m.BrandsModule)
            },  
            {
                path: 'active-principle',
                loadChildren: () => import('./modules/active-principle/active-principle.module').then(m => m.ActivePrincipleModule)
            },  
            {
                path: 'measurement',
                loadChildren: () => import('./modules/measurement/measurement.module').then(m => m.MeasurementModule)
            },  
            {
                path: 'category',
                loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule)
            }, 
            {
                path: 'accident',
                loadChildren: () => import('./modules/accident/accident.module').then(m => m.AccidentModule)
            },
            {
                path: 'ergonomic',
                loadChildren: () => import('./modules/ergonomic/ergonomic.module').then(m => m.ErgonomicModule)
            }, 
            {
                path: 'incident',
                loadChildren: () => import('./modules/incident/incident.module').then(m => m.IncidentModule)
            },  
            {
                path: 'articles',
                loadChildren: () => import('./modules/articles/articles.module').then(m => m.ArticlesModule)
            },  
            {
                path: 'movements',
                loadChildren: () => import('./modules/movements/movements.module').then(m => m.MovementsModule)
            }, 
            {
                path: 'protection',
                loadChildren: () => import('./modules/protection/protection.module').then(m => m.ProtectionModule)
            },  
            {
                path: 'operation-change',
                loadChildren: () => import('./modules/operation-change/operation-change.module').then(m => m.OperationChangeModule)
            },  
            {
                path: 'users',
                loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
            },  
            {
                path: 'areas',
                loadChildren: () => import('./modules/areas/areas.module').then(m => m.AreasModule)
            },  
            {
                path: 'actions',
                loadChildren: () => import('./modules/actions/actions.module').then(m => m.ActionsModule)
            },  
            {
                path: 'incapacity',
                loadChildren: () => import('./modules/incapacity/incapacity.module').then(m => m.IncapacityModule)
            },  
            {
                path: 'exitpass',
                loadChildren: () => import('./modules/exitpass/exitpass.module').then(m => m.ExitpassModule)
            }, 
            {
                path: 'recipe',
                loadChildren: () => import('./modules/recipe/recipe.module').then(m => m.RecipeModule)
            }, 
            {
                path: 'binnacle',
                loadChildren: () => import('./modules/binnacle/binnacle.module').then(m => m.BinnacleModule)
            }, 
            {
                path: 'investigation',
                loadChildren: () => import('./modules/investigation/investigation.module').then(m => m.InvestigationModule)
            }, 
            {
                path: 'reports',
                loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule)
            }, 
            {
                path: 'expedients',
                loadChildren: () => import('./modules/expedients/expedients.module').then(m => m.ExpedientsModule)
            },
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
            {
                path: 'responsible',
                loadChildren: () => import('./modules/responsible/responsible.module').then(m => m.ResponsibleModule),
                data: {
                    title: 'Responsables',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Admin', url: '/admin' },
                        { title: 'Responsables' }
                    ]
                }
            },
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
            }
        ]
    }
];

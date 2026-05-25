import { Routes } from '@angular/router';
import { ListIncidentComponent } from './pages/list-incident/list-incident.component';
import { StoreIncidentComponent } from './pages/store-incident/store-incident.component';

export const IncidentRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: ListIncidentComponent,
                data: {
                    title: 'Listado de incidentes',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado' },
                    ],
                }
            },
            {
                path: 'add',
                component: StoreIncidentComponent,
                data: {
                    title: 'Agregar incidentes',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado', url: '/incident' },
                        { title: 'Agregar' },
                    ],
                }
            },
            {
                path: ':id',
                component: StoreIncidentComponent,
            },
        ]
    }
];

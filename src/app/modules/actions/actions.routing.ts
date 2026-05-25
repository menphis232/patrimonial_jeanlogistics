import { Route } from '@angular/router';
import { ListActionsComponent } from './pages/list-actions/list-actions.component';
import { ListGeneralActionsComponent } from './pages/list-general-actions/list-general-actions.component';
import { ListResponsibleActionsComponent } from './pages/list-responsible-actions/list-responsible-actions.component';

export const ActionsRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListActionsComponent,
                data: {
                    title: 'Listado de responsables',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de responsables' },
                    ],
                },
            }
        ]
    },
    {
        path: 'general-actions',
        component: ListGeneralActionsComponent,
        data: {
            title: 'Listado de acciones',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'responsible-actions/:id',
        component: ListResponsibleActionsComponent,
        data: {
            title: 'Listado de acciones del responsable',
            urls: [
                { title: 'Listado de acciones', url: '/general-actions' },
                { title: 'Listado' },
            ],
        }
    },
];

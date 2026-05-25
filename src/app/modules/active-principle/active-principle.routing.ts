import { Route } from '@angular/router';
import { ListActivePrincipleComponent } from './pages/list-active-principle/list-active-principle.component';
import { StoreActivePrincipleComponent } from './pages/store-active-principle/store-active-principle.component';




export const ActivePricipleRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListActivePrincipleComponent,
                data: {
                    title: 'Listado de principios activos',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de principios activos' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreActivePrincipleComponent,
                data: {
                    title: 'Agregar principio activo',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de principio activo', url: '/active-principle/list' },
                        { title: 'Agregar principio activo' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreActivePrincipleComponent,
                data: {
                    title: 'Actualizar marca',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de principios activos', url: '/active-principle/list' },
                        { title: 'Actualizar principio activo' },
                    ],
                },
            }
        ]
    },
];

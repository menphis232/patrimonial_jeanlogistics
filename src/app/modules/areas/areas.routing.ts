import { Route } from '@angular/router';
import { ListAreasComponent } from './pages/list-areas/list-areas.component';
import { StoreAreasComponent } from './pages/store-areas/store-areas.component';



export const AreasRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListAreasComponent,
                data: {
                    title: 'Listado de areas',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de areas' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreAreasComponent,
                data: {
                    title: 'Agregar area',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de areas', url: '/users/list' },
                        { title: 'Agregar area' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreAreasComponent,
                data: {
                    title: 'Actualizar area',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de areas', url: '/users/list' },
                        { title: 'Actualizar area' },
                    ],
                },
            }
        ]
    },
];

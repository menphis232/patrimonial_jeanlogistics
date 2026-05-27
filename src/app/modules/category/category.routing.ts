import { Route } from '@angular/router';
import { ListCategoryComponent } from './pages/list-category/list-category.component';
import { StoreCategoryComponent } from './pages/store-category/store-category.component';
import { ListTurnsComponent } from './pages/list-turns/list-turns.component';
import { StoreTurnComponent } from './pages/store-turn/store-turn.component';
export const CategoryRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list/turns',
                component: ListTurnsComponent,
                data: {
                    title: 'Listado de turnos',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de turnos' },
                    ],
                },
            },
            {
                path: 'list',
                pathMatch: 'full',
                component: ListCategoryComponent,
                data: {
                    title: 'Listado de guardias de seguridad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de guardias de seguridad' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreCategoryComponent,
                data: {
                    title: 'Agregar guardia de seguridad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de guardias de seguridad', url: '/category/list' },
                        { title: 'Agregar guardia de seguridad' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreCategoryComponent,
                data: {
                    title: 'Actualizar categoria',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de guardias de seguridad', url: '/category/list' },
                        { title: 'Actualizar guardia de seguridad' },
                    ],
                },
            },
            {
                path: 'add/turn',
                component: StoreTurnComponent,
                data: {
                    title: 'Agregar turno',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de turnos', url: '/category/list/turns' },
                        { title: 'Agregar turno' },
                    ],
                },
            },
            {
                path: 'edit/turn/:id',
                component: StoreTurnComponent,
                data: {
                    title: 'Actualizar turno',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de turnos', url: '/category/list/turns' },
                        { title: 'Actualizar turno' },
                    ],
                },
            }
        ]
    },
];

import { Route } from '@angular/router';
import { ListUsersComponent } from './pages/list-users/list-users.component';
import { StoreUsersComponent } from './pages/store-users/store-users.component';



export const UsersRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListUsersComponent,
                data: {
                    title: 'Listado de usuarios',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de usuarios' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreUsersComponent,
                data: {
                    title: 'Agregar usuario',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de usuarios', url: '/users/list' },
                        { title: 'Agregar usuario' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreUsersComponent,
                data: {
                    title: 'Actualizar usuario',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de usuarios', url: '/users/list' },
                        { title: 'Actualizar usuario' },
                    ],
                },
            }
        ]
    },
];

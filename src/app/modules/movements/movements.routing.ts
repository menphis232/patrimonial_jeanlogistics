import { Route } from '@angular/router';
import { ListMovementsComponent } from './pages/list-movements/list-movements.component';
import { StoreMovementsComponent } from './pages/store-movements/store-movements.component';

export const MovementsRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListMovementsComponent,
                data: {
                    title: 'Evaluación de vulnerabilidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Evaluación de vulnerabilidad' },
                    ],
                },
            },
            {
                path: 'add-vulnerability',
                component: StoreMovementsComponent,
                data: {
                    title: 'Nueva Eval Vulnerabilidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Evaluación de vulnerabilidad', url: '/movements/list' },
                        { title: 'Nueva evaluación' },
                    ],
                },
            },
            {
                path: 'edit-vulnerability/:id',
                component: StoreMovementsComponent,
                data: {
                    title: 'Editar Eval Vulnerabilidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboard' },
                        { title: 'Evaluación de vulnerabilidad', url: '/movements/list' },
                        { title: 'Editar evaluación' },
                    ],
                },
            },
        ]
    },
];

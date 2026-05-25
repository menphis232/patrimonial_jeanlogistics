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
                    title: 'Listado de vulnerabilidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de vulnerabilidad' },
                    ],
                },
            },
           
            
        ]
    },
];

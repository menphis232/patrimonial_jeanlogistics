import { Route } from '@angular/router';
import { ListBinnacleComponent } from './pages/list-binnacle/list-binnacle.component';



export const BinnacleRoutes: Route[] = [
    {
        path: '',
        children: [
  
            {
                path: 'list',
                component: ListBinnacleComponent,
                data: {
                    title: 'Bitácora diaria',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Bitácora diaria' },
                    ],
                },
            },
        ]
    },
];

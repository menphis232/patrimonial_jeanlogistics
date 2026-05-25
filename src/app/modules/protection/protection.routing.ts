import { Route } from '@angular/router';
import { ListProtectionComponent } from './pages/list-protection/list-protection.component';
import { StoreProtectionComponent } from './pages/store-protection/store-protection.component';

export const ProtectionRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListProtectionComponent,
                data: {
                    title: 'Listado de protección',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de protección' },
                    ],
                },
            },
           
            
        ]
    },
];

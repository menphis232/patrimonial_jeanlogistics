import { Route } from '@angular/router';
import { StoreExitpassComponent } from './pages/store-exitpass/store-exitpass.component';



export const ExitpassRoutes: Route[] = [
    {
        path: '',
        children: [
  
            {
                path: 'generate/:medical_consultation_id',
                component: StoreExitpassComponent,
                data: {
                    title: 'Generar pase de salida',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Generar pase de salida' },
                    ],
                },
            },
        ]
    },
];

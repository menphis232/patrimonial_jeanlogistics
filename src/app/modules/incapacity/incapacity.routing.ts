import { Route } from '@angular/router';
import { ValidateIncapacityComponent } from './pages/validate-incapacity/validate-incapacity.component';
import { ListIncapacityComponent } from './pages/list-incapacity/list-incapacity.component';


export const IncapacityRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListIncapacityComponent,
                data: {
                    title: 'Listado de incapacidades',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de incapacidades' },
                    ],
                },
            },
            {
                path: 'validate/:medical_consultation_id',
                component: ValidateIncapacityComponent,
                data: {
                    title: 'Validar incapacidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de incapacidades', url: '/incapacity/list' },
                        { title: 'Validar incapacidad' },
                    ],
                },
            },
            {
                path: 'add',
                component: ValidateIncapacityComponent,
                data: {
                    title: 'Validar incapacidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de incapacidades', url: '/incapacity/list' },
                        { title: 'Validar incapacidad' },
                    ],
                }
            },
            {
                path: 'add/:idPatient',
                component: ValidateIncapacityComponent,
                data: {
                    title: 'Validar incapacidad',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de incapacidades', url: '/incapacity/list' },
                        { title: 'Validar incapacidad' },
                    ],
                }
            },
        ]
    },
];

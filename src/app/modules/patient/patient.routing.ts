import { Route } from '@angular/router';
import { ListPatientComponent } from './pages/list-patient/list-patient.component';
import { StorePatientComponent } from './pages/store-patient/store-patient.component';


export const PatientRoutes: Route[] = [
    {
        path: '',
        component: ListPatientComponent,
        data: {
            title: 'Listado de centro de costo',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'add',
        component: StorePatientComponent,
        data: {
            title: 'Agregar centro de costo',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/patient' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: ':id',
        component: StorePatientComponent,
    },
];

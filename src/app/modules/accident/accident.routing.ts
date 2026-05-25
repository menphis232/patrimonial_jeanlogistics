import { Route } from '@angular/router';
import { ListAccidentComponent } from './pages/list-accident/list-accident.component';
import { StoreAccidentComponent } from './pages/store-accident/store-accident.component';


export const AccidentRoutes: Route[] = [
    {
        path: '',
        component: ListAccidentComponent,
        data: {
            title: 'Listado de accidentes',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'add',
        component: StoreAccidentComponent,
        data: {
            title: 'Agregar accidente',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/accident' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: 'add/:idPatient',
        component: StoreAccidentComponent,
        data: {
            title: 'Agregar accidente',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/accident' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: ':id',
        component: StoreAccidentComponent,
    },
];

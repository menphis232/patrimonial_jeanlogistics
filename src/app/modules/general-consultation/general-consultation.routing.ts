import { Route } from '@angular/router';
import { ListGeneralConsultationComponent } from './pages/list-general-consultation/list-general-consultation.component';
import { StoreGeneralConsultationComponent } from './pages/store-general-consultation/store-general-consultation.component';


export const GeneralConsultationRoutes: Route[] = [
    {
        path: '',
        component: ListGeneralConsultationComponent,
        data: {
            title: 'Listado de consulta general',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'add',
        component: StoreGeneralConsultationComponent,
        data: {
            title: 'Agregar consulta general',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/general-consultation' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: 'add/:idPatient',
        component: StoreGeneralConsultationComponent,
        data: {
            title: 'Agregar consulta general',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/general-consultation' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: ':id',
        data: {
            title: 'Editar consulta general',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/general-consultation' },
                // { title: 'Agregar' },
            ],
        },
        component: StoreGeneralConsultationComponent,
    },
];

import { Route } from '@angular/router';
import { ListInvestigationComponent } from './pages/list-investigation/list-investigation.component';
import { StoreInvestigationComponent } from './pages/store-investigation/store-investigation.component';


export const InvestigationRoutes: Route[] = [
    {
        path: '',
        component: ListInvestigationComponent,
        data: {
            title: 'Listado de investigación',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'generate/:medical_consultation_id',
        component: StoreInvestigationComponent,
        data: {
            title: 'Agregar investigación',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/investigation' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: ':id',
        component: StoreInvestigationComponent,
    },
];

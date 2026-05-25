import { Route } from '@angular/router';
import { ListReportsComponent } from './pages/list-reports/list-reports.component';


export const ReportsRoutes: Route[] = [
    {
        path: '',
        component: ListReportsComponent,
        data: {
            title: 'Reportes',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },

];

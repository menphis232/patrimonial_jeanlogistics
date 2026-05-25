import { Route } from '@angular/router';
import { ListMeasurementComponent } from './pages/list-measurement/list-measurement.component';
import { StoreMeasurementComponent } from './pages/store-measurement/store-measurement.component';


export const MeasurementRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListMeasurementComponent,
                data: {
                    title: 'Listado de unidad de medida',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de unidads de medida' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreMeasurementComponent,
                data: {
                    title: 'Agregar unidad de medida',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de unidads de medida', url: '/measurement/list' },
                        { title: 'Agregar unidad de medida' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreMeasurementComponent,
                data: {
                    title: 'Actualizar unidad de medida',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de unidads de medida', url: '/measurement/list' },
                        { title: 'Actualizar unidad de medida' },
                    ],
                },
            }
        ]
    },
];

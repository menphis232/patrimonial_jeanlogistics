import { Route } from '@angular/router';
import { ListOperationChangeComponent } from './pages/list-operation-change/list-operation-change.component';
import { StoreOperationChangeComponent } from './pages/store-operation-change/store-operation-change.component';
import { SetControlsComponent } from './components/set-controls/set-controls.component';


export const OperationChangeRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListOperationChangeComponent,
                data: {
                    title: 'Listado de cambio de operaciones',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de cambio de operaciones' },
                    ],
                },
            },
            {
                path: 'store/:patient_id',
                component: StoreOperationChangeComponent,
                data: {
                    title: 'Actualizar cambio de operaciones',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de cambio de operaciones', url: '/operation-change/list' },
                        { title: 'Actualizar cambio de operacion' },
                    ],
                },
            },
            {
                path: 'setcontrols/:id',
                component: SetControlsComponent,
                data: {
                    title: 'Establecer controles',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de cambio de operaciones', url: '/operation-change/list' },
                        { title: 'Establecer controles de cambio de operacion' },
                    ],
                },
            },
        ]
    },
];

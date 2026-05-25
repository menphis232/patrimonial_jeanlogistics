import { Route } from '@angular/router';
import { ListEmployeeComponent } from './pages/list-employee/list-employee.component';
import { StoreEmployeeComponent } from './pages/store-employee/store-employee.component';
import { DetailEmployeeComponent } from './pages/detail-employee/detail-employee.component';


export const EmployeeRoutes: Route[] = [
    {
        path: '',
        component: ListEmployeeComponent,
        data: {
            title: 'Listado de ingresos',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado' },
            ],
        }
    },
    {
        path: 'add',
        component: StoreEmployeeComponent,
        data: {
            title: 'Agregar ingreso',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/employee' },
                { title: 'Agregar' },
            ],
        }
    },
    {
        path: ':id',
        component: StoreEmployeeComponent,
        data: {
            title: 'Editar ingreso',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/employee' },
                { title: 'Editar' },
            ],
        }
    },
    {
        path: 'detail/:id',
        data: {
            title: 'Ficha del empleado',
            urls: [
                { title: 'Dashboard', url: '/dashboards' },
                { title: 'Listado', url: '/employee' },
                { title: 'Agregar' ,url:'/add' },
            ],
        },
        component: DetailEmployeeComponent,
    },
];

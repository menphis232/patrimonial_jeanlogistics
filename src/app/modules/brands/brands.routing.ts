import { Route } from '@angular/router';
import { ListBrandsComponent } from './pages/list-brands/list-brands.component';
import { StoreBrandsComponent } from './pages/store-brands/store-brands.component';



export const BrandsRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListBrandsComponent,
                data: {
                    title: 'Inventario general',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de inventario general' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreBrandsComponent,
                data: {
                    title: 'Agregar inventario general',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de inventarion general', url: '/brands/list' },
                        { title: 'Agregar inventario general' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreBrandsComponent,
                data: {
                    title: 'Actualizar  inventario general',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de marcas', url: '/brands/list' },
                        { title: 'Actualizar marca' },
                    ],
                },
            }
        ]
    },
];

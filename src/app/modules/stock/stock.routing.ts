import { Route } from '@angular/router';
import { ListStockComponent } from './pages/list-stock/list-stock.component';
import { StoreStockComponent } from './pages/store-stock/store-stock.component';

export const StockRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListStockComponent,
                data: {
                    title: 'Listado de stock',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de stock' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreStockComponent,
                data: {
                    title: 'Agregar stock',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de stock', url: '/stock/list' },
                        { title: 'Agregar stock' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreStockComponent,
                data: {
                    title: 'Actualizar stock',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de stock', url: '/stock/list' },
                        { title: 'Actualizar stock' },
                    ],
                },
            }
        ]
    },
];

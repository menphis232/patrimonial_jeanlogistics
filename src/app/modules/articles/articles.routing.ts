import { Route } from '@angular/router';
import { StoreArticlesComponent } from './pages/store-articles/store-articles.component';
import { ListArticlesComponent } from './pages/list-articles/list-articles.component';



export const ArticlesRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                path: 'list',
                component: ListArticlesComponent,
                data: {
                    title: 'Listado de articulos',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de articulos' },
                    ],
                },
            },
            {
                path: 'add',
                component: StoreArticlesComponent,
                data: {
                    title: 'Agregar articulo',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de articulos', url: '/articles/list' },
                        { title: 'Agregar articulo' },
                    ],
                },
            },
            {
                path: 'edit/:id',
                component: StoreArticlesComponent,
                data: {
                    title: 'Actualizar articulo',
                    urls: [
                        { title: 'Dashboard', url: '/dashboards' },
                        { title: 'Listado de articulos', url: '/articles/list' },
                        { title: 'Actualizar articulo' },
                    ],
                },
            }
        ]
    },
];

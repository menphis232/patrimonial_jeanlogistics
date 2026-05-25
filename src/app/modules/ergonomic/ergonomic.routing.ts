import { Route } from '@angular/router';
import { ListErgonomicComponent } from './pages/list-ergonomic/list-ergonomic.component';
import { StoreErgonomicComponent } from './pages/store-ergonomic/store-ergonomic.component';
import { ListToursComponent } from './pages/list-tours/list-tours.component';

export const ErgonomicRoutes: Route[] = [
  {
      path: 'list',
      component: ListErgonomicComponent,
      data: {
          title: 'Listado de áreas',
          urls: [
              { title: 'Dashboard', url: '/dashboards' },
              { title: 'Listado' },
          ],
      }
  },
  {
    path: 'list/tours',
    component: ListToursComponent,
    data: {
        title: 'Listado de recorridos',
        urls: [
            { title: 'Dashboard', url: '/dashboards' },
            { title: 'Listado' },
        ],
    }
},
  {
      path: 'add',
      component: StoreErgonomicComponent,
      data: {
          title: 'Agregar área',
          urls: [
              { title: 'Dashboard', url: '/dashboards' },
              { title: 'Listado', url: '/ergonomic' },
              { title: 'Agregar' },
          ],
      }
  },
  {
      path: 'edit/:id',
      component: StoreErgonomicComponent,
  },
];


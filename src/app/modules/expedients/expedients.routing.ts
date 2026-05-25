import { Route } from '@angular/router';
import { ListExpedientsComponent } from './pages/list-expedients/list-expedients.component';
import { StoreExpedientsComponent } from './pages/store-expedients/store-expedients.component';
import { ListToursComponent } from './pages/list-tours/list-tours.component';

export const ExpedientsRoutes: Route[] = [
  {
      path: 'list',
      component: ListExpedientsComponent,
      data: {
          title: 'Listado de expedientes',
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
      component: StoreExpedientsComponent,
      data: {
          title: 'Agregar expediente',
          urls: [
              { title: 'Dashboard', url: '/dashboards' },
              { title: 'Listado', url: '/expedients' },
              { title: 'Agregar' },
          ],
      }
  },
  {
      path: 'edit/:id',
      component: StoreExpedientsComponent,
  },
];


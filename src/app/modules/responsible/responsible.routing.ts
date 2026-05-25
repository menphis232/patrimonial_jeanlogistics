import { Routes } from '@angular/router';
import { ListResponsibleComponent } from './pages/list-responsible/list-responsible.component';
import { FormResponsibleComponent } from './pages/form-responsible/form-responsible.component';

export const ResponsibleRoutes: Routes = [
  {
    path: '',
    component: ListResponsibleComponent
  },
  {
    path: 'create',
    component: FormResponsibleComponent
  },
  {
    path: 'edit/:id',
    component: FormResponsibleComponent
  }
]; 

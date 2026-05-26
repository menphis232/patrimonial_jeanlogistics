import { Routes } from '@angular/router';
import { ListAreaCategoryComponent } from './pages/list-area-category/list-area-category.component';
import { FormAreaCategoryComponent } from './pages/form-area-category/form-area-category.component';

export const AreaCategoryRoutes: Routes = [
  {
    path: '',
    component: ListAreaCategoryComponent
  },
  {
    path: 'create',
    component: FormAreaCategoryComponent
  },
  {
    path: 'edit/:id',
    component: FormAreaCategoryComponent
  }
];


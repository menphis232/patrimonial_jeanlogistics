const routes: Routes = [
  // ... existing routes ...
  {
    path: 'responsible',
    loadChildren: () => import('./modules/responsible/responsible.module').then(m => m.ResponsibleModule)
  },
  // ... existing routes ...
]; 
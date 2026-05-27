import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    navCap: 'APPS',
  },
  {
    displayName: 'Incidentes',
    iconName: 'medical-cross-filled',
    route: '/incident',
  },
  {
    displayName: 'Recorrido de seguridad',
    iconName: 'route',
    children: [
      {
        displayName: 'Listado de recorridos',
        iconName: 'shield',
        route: 'ergonomic/list/tours',
      },
      {
        displayName: 'Listado de guardia de seguridad',
        iconName: 'shield',
        route: 'category/list',
      },
      {
        displayName: 'Turnos',
        iconName: 'calendar-check',
        route: 'category/list/turns',
      },
    ],
  },
  {
    displayName: 'Puntos de vulnerabilidad',
    iconName: 'activity',
    children: [
      {
        displayName: 'Listado de puntos de vulnerabilidad',
        iconName: 'activity',
        route: '/vulnerability-points',
      },
      {
        displayName: 'Acciones Correctivas',
        iconName: 'components',
        route: '/vulnerability-points/actions',
      },
    ],
  },
  {
    displayName: 'Análisis de riesgo',
    iconName: 'checklist',
    children: [
      {
        displayName: 'Expedientes',
        iconName: 'file-text',
        route: '/expedients/list',
      },
      {
        displayName: 'Evaluación de vulnerabilidad',
        iconName: 'alert-triangle',
        route: 'movements/list',
      },
      {
        displayName: 'Evaluación de protección',
        iconName: 'shield',
        route: 'protection/list',
      },
    ],
  },
  {
    displayName: 'Admin',
    iconName: 'brand-databricks',
    children: [
      {
        displayName: 'Usuarios',
        iconName: 'users',
        route: '/users/list',
      },
      {
        displayName: 'Centro de coste',
        iconName: 'building-community',
        route: '/patient',
      },
      {
        displayName: 'Responsables',
        iconName: 'user-check',
        route: '/responsible',
      },
      {
        displayName: 'Categorías de área',
        iconName: 'category',
        route: '/area-categories',
      },
      {
        displayName: 'Áreas',
        iconName: 'arrow-right-circle',
        route: 'ergonomic/list',
      },
      {
        displayName: 'Inventario general',
        iconName: 'tag',
        route: 'brands/list',
      },
    ],
  },
];

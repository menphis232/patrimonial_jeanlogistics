import { NavItem } from "src/app/layouts/full/vertical/sidebar/nav-item/nav-item";

export const ROUTES_NAVIGATION: NavItem[] = new Array(
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: '/dashboard',
  },
  {
    navCap: 'APPS',
  },
  // {
  //   displayName: 'Pacientes',
  //   iconName: 'medical-cross-filled',
  //   route: '/patient',
  // },
  // {
  //   displayName: 'Cambio de operaciones',
  //   iconName: 'transform',
  //   route: '/operation-change/list',
  // },
 
  // {
  //   displayName: 'Incapacidades',
  //   iconName: 'disabled',
  //   route: '/incapacity/list',
  // },
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
  // {
  //   route: '/vulnerability-points',
  //   displayName: 'Puntos de Vulnerabilidad',
  //   iconName: 'activity',

  // },
  {
    displayName: 'Incidentes',
    iconName: 'medical-cross-filled',
    route: '/incident',
  },
  {
    displayName: 'Expedientes',
    iconName: 'medical-cross-filled',
    route: '/expedients/list',
  },
  // {
  //   displayName: 'Consultas',
  //   iconName: 'medical-cross-filled',
  //   children: [
  //     {
  //       displayName: 'Incidentes',
  //       iconName: 'medical-cross-filled',
  //       route: '/incident',
  //     },
  //     {
  //       displayName: 'Ergonómico',
  //       iconName: 'medical-cross-filled',
  //       route: '/ergonomic',
  //     },
  //     {
  //       displayName: 'Consulta general',
  //       iconName: 'medical-cross-filled',
  //       route: '/general-consultation',
  //     },
  //     {
  //       displayName: 'Bitácora diaria',
  //       iconName: 'medical-cross-filled',
  //       route: '/binnacle/list',
  //     },
  //     {
  //       displayName: 'Accidentes',
  //       iconName: 'medical-cross-filled',
  //       route: '/accident',
  //     },
  //     {
  //       displayName: 'Reportes',
  //       iconName: 'medical-cross-filled',
  //       route: '/reports',
  //     },
  //   ],
  // },
  {
    displayName: 'Guardia de seguridad',
    iconName: 'shield',
    children: [
      {
        displayName: 'Guardias de seguridad',
        iconName: 'shield',
        route: 'category/list',
      },
      {
        displayName: 'Turnos',
        iconName: 'calendar-check',
        route: 'category/list/turns',
      },
    ]
  },
  {
    displayName: 'Recorrido de seguridad',
    iconName: 'route',
    children: [
      {
        displayName: 'Recorrido de seguridad',
        iconName: 'shield',
        route: 'ergonomic/list/tours',
      },
      {
        displayName: 'Áreas',
        iconName: 'arrow-right-circle',
        route: 'ergonomic/list',
      },
    ]
  },
  {
    displayName: 'Inventario',
    iconName: 'box-seam',
    children: [
      {
        displayName: 'Inventario general',
        iconName: 'tag',
        route: 'brands/list',
      },
      // {
      //   displayName: 'Principios activos',
      //   iconName: 'brand-stackoverflow',
      //   route: 'active-principle/list',
      // },
      // {
      //   displayName: 'Unidades de medida',
      //   iconName: 'ruler-measure',
      //   route: 'measurement/list',
      // },
      // {
      //   displayName: 'Categorias',
      //   iconName: 'category',
      //   route: 'category/list',
      // },
      // {
      //   displayName: 'Articulos',
      //   iconName: 'article',
      //   route: 'articles/list',
      // },
      // {
      //   displayName: 'Movimientos',
      //   iconName: 'credit-card-pay',
      //   route: 'movements/list',
      // },
    ],
  },

  {
    displayName: 'Evaluaciones',
    iconName: 'checklist',
    children: [
      {
        displayName: 'Vulnerabilidad',
        iconName: 'alert-triangle',
        route: 'movements/list',
      },
      {
        displayName: 'Protección',
        iconName: 'alert-triangle',
        route: 'protection/list',
      },
    ]
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
    ],
  },

);

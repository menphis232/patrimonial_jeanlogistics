import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Router, NavigationEnd, ActivatedRoute, Data } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule, NgIf, TablerIconsModule, NgForOf],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class AppBreadcrumbComponent {
  // @Input() layout;
  pageInfo: Data | any = Object.create(null);
  myurl: any = this.router.url.slice(1).split('/');
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      // tslint:disable-next-line - Disables all
      .subscribe((event) => {
        // Verificar rutas específicas y asignar títulos personalizados
        if (this.router.url.includes('vulnerability-points/actions')) {
          event['title'] = 'Acciones Correctivas';
          event['urls'] = [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Puntos de Vulnerabilidad', url: '/vulnerability-points' },
            { title: 'Acciones Correctivas' }
          ];
        }
        else if (this.router.url.includes('vulnerability-points') && !event['title']) {
          event['title'] = 'Puntos de Vulnerabilidad';
          event['urls'] = [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Puntos de Vulnerabilidad' }
          ];
        }
        
        // tslint:disable-next-line - Disables all
        this.titleService.setTitle(event['title'] ? (event['title'] + ' - Angular 17') : 'Angular 17');
        this.pageInfo = event;
      });
  }

  getTitleFromUrl(): string {
    // Extraer y formatear un título a partir de la URL actual
    const path = this.router.url;
    
    // Mapa de rutas específicas a títulos
    const routeTitles = {
      '/vulnerability-points': 'Puntos de Vulnerabilidad',
      '/vulnerability-points/actions': 'Acciones Correctivas',
      // Añadir más mapeos según sea necesario
    };
    
    // Buscar la ruta más específica que coincida
    for (const route in routeTitles) {
      if (path.includes(route)) {
        return routeTitles[route];
      }
    }
    
    // Si no hay coincidencia, formatear el último segmento de la ruta
    const lastSegment = path.split('/').pop() || '';
    return this.formatPathAsTitle(lastSegment);
  }

  formatPathAsTitle(path: string): string {
    // Convertir kebab-case a Title Case
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  getDefaultUrls(): any[] {
    // Generar URLs predeterminadas basadas en la URL actual
    const path = this.router.url;
    
    if (path.includes('vulnerability-points/actions')) {
      return [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Puntos de Vulnerabilidad', url: '/vulnerability-points' },
        { title: 'Acciones Correctivas' }
      ];
    }
    
    return [
      { title: 'Dashboard', url: '/dashboard' },
      { title: this.getTitleFromUrl() }
    ];
  }
}

import { Injectable } from '@angular/core';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private _drawer: MatDrawer | null = null;

  private drawerSubject = new BehaviorSubject<MatDrawer | null>(this._drawer);

  public backRoute: string = "../"

  public queryParams: any = {};

  constructor(
    private _router: Router,
  ) { }

  setDrawer(drawer: MatDrawer) {
    this._drawer = drawer;
    this.drawerSubject.next(this._drawer);
  }

  getDrawer(): MatDrawer | null {
    return this.drawerSubject.getValue();
  }

/**
 * Abre el drawer
 * 
 * @param options 
 * @param  options.backRoute La ruta a la que navegar cuando el usuario presione el botón de retroceso en el drawer.
 * @param options.queryParams Los parámetros de consulta que se deben incluir en la backRoute.
 * @returns
 */
  openDrawer(options: { backRoute?: string, queryParams?: any } = {}) {
    const drawer = this.drawerSubject.getValue();

    if (!drawer){
      console.error("Drawer is null")
      return false;
    } 

    this.backRoute   = options.backRoute || this.backRoute;
    this.queryParams = options.queryParams || {}

    return drawer.open();
  }

  closeDrawer() {
    const drawer = this.drawerSubject.getValue();

    if (!drawer){
      console.error("Drawer is null")
      return null;
    }

    this.backTo()
    return drawer.close();
  }

  backTo(){
    this._router.navigate([ this.backRoute ], {
      queryParams: this.queryParams
    })
  }

}

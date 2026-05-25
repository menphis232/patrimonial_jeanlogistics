import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DrawerService } from '../services/drawer.service';

@Component({
  selector: 'drawer-container',
  templateUrl: './drawer-container.component.html',
  styleUrls: ['./drawer-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerContainerComponent implements OnInit {

  @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  drawerMode: 'side' | 'over';

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _drawerService: DrawerService
  ) { }

  ngOnInit(): void {

    this._drawerService.setDrawer(this.matDrawer)

    // this._fuseMediaWatcherService.onMediaQueryChange$('(min-width: 1440px)')
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe((state) => {

    //     // Calculate the drawer mode
    //     this.drawerMode = 'over';

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();
    //   });
  }

  
  /**
    * On backdrop clicked
    */
  onBackdropClicked(): void {
    // Go back to the list
    this._drawerService.closeDrawer()

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  onDrawerClosedStart(){
    console.log("Start")
  }

  onDrawerClosed(){
    console.log("Closed")
  }

}

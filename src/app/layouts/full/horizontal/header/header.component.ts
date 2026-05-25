import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../../vertical/sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { BrandingComponent } from '../../vertical/sidebar/branding.component';
import { NgFor, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreService } from 'src/app/core/services/core.service';
import { NavigationService } from 'src/app/core/navigation/navigation.service';
import { Subject, takeUntil } from 'rxjs';
import { Navigation } from 'src/app/core/navigation/navigation.types';
import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';
import { AuthService } from 'src/app/core/auth/auth.service';
import { OfficeSelectComponent } from '../office-select/office-select.component';

interface notifications {
  id: number;
  img: string;
  title: string;
  subtitle: string;
}

interface profiledd {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface apps {
  id: number;
  img: string;
  title: string;
  subtitle: string;
  link: string;
}

interface quicklinks {
  id: number;
  title: string;
  link: string;
}

@Component({
  selector: 'app-horizontal-header',
  standalone: true,
  imports: [RouterModule, TablerIconsModule, MaterialModule, BrandingComponent, NgFor, OfficeSelectComponent],
  templateUrl: './header.component.html',
})
export class AppHorizontalHeaderComponent {
   @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  user:any
  showFiller = false;


  constructor(
    private vsidenav: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private _authService: AuthService,
    private _router: Router
  ) {
    translate.setDefaultLang('en');
    const usuario=JSON.parse(localStorage.getItem('user'))

    this.user=usuario
  }

  openDialog() {
    const dialogRef = this.dialog.open(AppHorizontalSearchDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  profiledd: profiledd[] = [
    // {
    //   id: 1,
    //   img: '/assets/images/svgs/icon-account.svg',
    //   title: 'My Profile',
    //   subtitle: 'Account Settings',
    //   link: '/',
    // },
    // {
    //   id: 2,
    //   img: '/assets/images/svgs/icon-inbox.svg',
    //   title: 'My Inbox',
    //   subtitle: 'Messages & Email',
    //   link: '/',
    // },
    // {
    //   id: 3,
    //   img: '/assets/images/svgs/icon-tasks.svg',
    //   title: 'My Tasks',
    //   subtitle: 'To-do and Daily Tasks',
    //   link: '/',
    // },
  ];

  signOut() {
    this._authService.signOut();
    this._router.navigate(['sign-in']);
  }

}

@Component({
  selector: 'app-search-dialog',
  standalone: true,
  imports: [RouterModule, MaterialModule, TablerIconsModule, FormsModule, NgForOf],
  templateUrl: 'search-dialog.component.html',
})
export class AppHorizontalSearchDialogComponent implements OnInit{
  searchText: string = '';
  navItemsData;
user:any
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor( 
    private _navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this._navigationService.navigation$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((navigation: Navigation) => {
          this.navItemsData = navigation.default.filter((navitem) => navitem.displayName)   
      });

      const usuario=JSON.parse(localStorage.getItem('user'))

      this.user=usuario

    
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
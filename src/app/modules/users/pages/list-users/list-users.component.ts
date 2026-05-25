import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})
export class ListUsersComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination
  public displayedColumns: string[] = [
    'date',
    'farm',
    'create_by',
    'actions'
  ];
  constructor(
    private _usersService: UsersService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService
  ) { }

  get users$(): Observable<any[]> {
    return this.pagination.data$
  }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate())
    this.pagination.next()
  }

  /**
    * After view init
    */
  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page])
  }


  paginate(): void {
    this.pagination.perPage = 9;
    this._usersService.list(this.pagination);
  }


  getRolString(roles: string[]): string {

    if (!roles) {
      return '';
    }

    return roles.map((rol) => rol['name']).join(', ');
  }

  /**
  * Remove record
  * 
  * @param {string} name Nombre del archivo
  */
  destroy(id: string) {
    const dialogRef = this._confirmation.dialogRemove()

    dialogRef.afterClosed().subscribe((result) => {

      if (result != 'confirmed')
        return;

      this._usersService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }
}

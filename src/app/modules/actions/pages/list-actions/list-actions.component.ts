import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ActionsService } from '../../services/actions.service';

@Component({
  selector: 'app-list-actions',
  templateUrl: './list-actions.component.html',
  styleUrls: ['./list-actions.component.scss'],
})
export class ListActionsComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination

  constructor(
    private _actionsService: ActionsService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService
  ) { }

  get actions$(): Observable<any[]> {
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
    this._actionsService.list(this.pagination);
  }


  getRolString(roles: string[]): string {

    if (!roles) {
      return '';
    }

    return roles.map((rol) => rol['name']).join(', ');
  }


}

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { Observable } from 'rxjs';
import { ArticlesService } from '../../services/articles.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-list-articles',
  templateUrl: './list-articles.component.html',
  styleUrls: ['./list-articles.component.scss'],
})
export class ListArticlesComponent implements OnInit {

  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: MatPagination = new MatPagination

  constructor(
    private _articlesService: ArticlesService,
    private _confirmation: ConfirmationService,
    private _notificationMessage: ToastrService
  ) {}

  get articles$(): Observable<any[]> {
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
    this._articlesService.list(this.pagination);
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

      this._articlesService.delete(id).subscribe((response) => {
        this._notificationMessage.success("Se eliminó correctamente")
        this.paginate()
      });

    });
  }
}

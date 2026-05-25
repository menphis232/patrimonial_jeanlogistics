import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmationService } from 'src/app/shared/services/confirmation/confirmation.service';
import { ResponsibleService } from '../../services/responsible.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-responsible',
  templateUrl: './list-responsible.component.html',
  styleUrls: ['./list-responsible.component.scss']
})
export class ListResponsibleComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) private paginator: MatPaginator;

  public pagination: any = {
    pageIndex: 0,
    perPage: 10,
    total: 0,
    search: '',
    isLoading: false,
    data: [],
    dataSubject: new BehaviorSubject<any[]>([]),
    data$: null,
    changeValues$: new BehaviorSubject<void>(undefined),
    next: function() {
      this.changeValues$.next();
    },
    listenPageChanges: function(events: any[]) {
      events.forEach(event => {
        event.subscribe((e: any) => {
          if (e) {
            this.pageIndex = e.pageIndex;
            this.perPage = e.pageSize;
            this.next();
          }
        });
      });
    }
  };

  public displayedColumns: string[] = [
    'name',
    'email',
    'phone',
    'farm',
    'actions'
  ];

  constructor(
    private _responsibleService: ResponsibleService,
    private _confirmation: ConfirmationService,
    private router: Router
  ) {
    this.pagination.data$ = this.pagination.dataSubject.asObservable();
  }

  get responsibles$(): Observable<any[]> {
    return this.pagination.data$;
  }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.pagination.listenPageChanges([this.paginator.page]);
    }
  }

  paginate(): void {
    this._responsibleService.list(this.pagination);
  }

  destroy(id: number) {
    const dialogRef = this._confirmation.dialogRemove();
    dialogRef.afterClosed().subscribe((result) => {
      if (result != 'confirmed') return;
      this._responsibleService.delete(id).subscribe(() => this.paginate());
    });
  }

  edit(id: number): void {
    this.router.navigate(['/responsible/edit', id]);
  }

  create(): void {
    this.router.navigate(['/responsible/create']);
  }
} 
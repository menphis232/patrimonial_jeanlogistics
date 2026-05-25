import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { Observable, of } from 'rxjs';
import { InvestigationService } from '../../services/investigation.service';

@Component({
  selector: 'app-list-investigation',
  templateUrl: './list-investigation.component.html',
  styleUrls: ['./list-investigation.component.scss']
})
export class ListInvestigationComponent implements OnInit {
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  
  public pagination: MatPagination = new MatPagination();
  public patients: any[] = [];
  public actions$: Observable<any[]> = of([]);

  constructor(
    private _investigationService: InvestigationService
  ) { }

  ngOnInit(): void {
    this.pagination.changeValues$.subscribe(() => this.paginate());
    this.pagination.next();
  }

  ngAfterViewInit(): void {
    this.pagination.listenPageChanges([this.paginator.page]);
  }

  paginate(): void {
    this._investigationService.list(this.pagination);
    this.actions$ = this.pagination.data$;
  }

  download(id: string): void {
    this._investigationService.download(id);
  }
}

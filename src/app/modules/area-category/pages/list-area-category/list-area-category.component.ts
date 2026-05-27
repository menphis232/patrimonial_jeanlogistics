import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPagination } from 'src/app/shared/mat-pagination/models/mat-pagination';
import { AreaCategoryService } from '../../services/area-category.service';

@Component({
  selector: 'app-list-area-category',
  templateUrl: './list-area-category.component.html'
})
export class ListAreaCategoryComponent implements OnInit {
  displayedColumns = ["name", "farm", "manager", "specialist", "actions"];
  data: any[] = [];
  pagination = new MatPagination();

  constructor(
    private areaCategoryService: AreaCategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.pagination.isLoading = true;
    this.areaCategoryService.list().subscribe({
      next: (e: any[]) => {
        this.data = e;
        this.pagination.total = e.length;
        this.pagination.isLoading = false;
      },
      error: () => {
        this.pagination.isLoading = false;
      }
    });
  }

  destroy(id: string | number): void {
    this.areaCategoryService.delete(id).subscribe(() => this.load());
  }
}

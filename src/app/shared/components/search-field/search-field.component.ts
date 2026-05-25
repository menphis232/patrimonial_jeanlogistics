import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { MatPagination } from '../../mat-pagination/models/mat-pagination';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit {

  /**
   * Instancia de paginación externa
   */
  @Input () pagination!: MatPagination;

  /**
   * Search form control
   */
  searchInputControl: FormControl = new FormControl();

  constructor() { }

  ngOnInit(): void {
    this.searchInputControl.valueChanges
                           .pipe(debounceTime(500))
                           .subscribe((value) => this.pagination.setSearch(value))
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListErgonomicComponent } from './list-ergonomic.component';

describe('ListErgonomicComponent', () => {
  let component: ListErgonomicComponent;
  let fixture: ComponentFixture<ListErgonomicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListErgonomicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListErgonomicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

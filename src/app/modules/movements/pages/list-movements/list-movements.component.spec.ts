import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListMovementsComponent } from './list-movements.component';

describe('ListMovementsComponent', () => {
  let component: ListMovementsComponent;
  let fixture: ComponentFixture<ListMovementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListMovementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMovementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

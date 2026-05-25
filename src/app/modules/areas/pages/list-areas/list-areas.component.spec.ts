import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListAreasComponent } from './list-areas.component';

describe('PatientsComponent', () => {
  let component: ListAreasComponent;
  let fixture: ComponentFixture<ListAreasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAreasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

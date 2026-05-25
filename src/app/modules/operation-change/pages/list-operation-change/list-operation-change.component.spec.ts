import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListOperationChangeComponent } from './list-operation-change.component';

describe('PatientsComponent', () => {
  let component: ListOperationChangeComponent;
  let fixture: ComponentFixture<ListOperationChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOperationChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOperationChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

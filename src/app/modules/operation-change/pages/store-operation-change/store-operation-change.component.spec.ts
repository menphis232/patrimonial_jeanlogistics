import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreOperationChangeComponent } from './store-operation-change.component';

describe('StoreOperationChangeComponent', () => {
  let component: StoreOperationChangeComponent;
  let fixture: ComponentFixture<StoreOperationChangeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreOperationChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOperationChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

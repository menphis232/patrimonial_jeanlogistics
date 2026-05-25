import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListIncapacityComponent } from './list-incapacity.component';

describe('ListIncapacityComponent', () => {
  let component: ListIncapacityComponent;
  let fixture: ComponentFixture<ListIncapacityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListIncapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListIncapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

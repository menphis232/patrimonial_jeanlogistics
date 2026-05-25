import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidateIncapacityComponent } from './validate-incapacity.component';

describe('ValidateIncapacityComponent', () => {
  let component: ValidateIncapacityComponent;
  let fixture: ComponentFixture<ValidateIncapacityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateIncapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateIncapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

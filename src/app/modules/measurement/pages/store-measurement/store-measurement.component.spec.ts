import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreMeasurementComponent } from './store-measurement.component';

describe('StoreMeasurementComponent', () => {
  let component: StoreMeasurementComponent;
  let fixture: ComponentFixture<StoreMeasurementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreMeasurementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreMeasurementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

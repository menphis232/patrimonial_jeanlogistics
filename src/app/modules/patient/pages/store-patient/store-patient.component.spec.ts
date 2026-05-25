import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StorePatientComponent } from './store-patient.component';

describe('StorePatientComponent', () => {
  let component: StorePatientComponent;
  let fixture: ComponentFixture<StorePatientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StorePatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorePatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

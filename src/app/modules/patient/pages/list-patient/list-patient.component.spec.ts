import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListPatientComponent } from './list-patient.component';

describe('PatientsComponent', () => {
  let component: ListPatientComponent;
  let fixture: ComponentFixture<ListPatientComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPatientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

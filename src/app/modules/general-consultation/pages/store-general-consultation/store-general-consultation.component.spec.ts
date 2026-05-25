import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreGeneralConsultationComponent } from './store-general-consultation.component';

describe('StoreGeneralConsultationComponent', () => {
  let component: StoreGeneralConsultationComponent;
  let fixture: ComponentFixture<StoreGeneralConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreGeneralConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreGeneralConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

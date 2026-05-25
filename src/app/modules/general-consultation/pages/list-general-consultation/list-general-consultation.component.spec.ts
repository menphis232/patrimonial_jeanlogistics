import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGeneralConsultationComponent } from './list-general-consultation.component';

describe('ListGeneralConsultationComponent', () => {
  let component: ListGeneralConsultationComponent;
  let fixture: ComponentFixture<ListGeneralConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGeneralConsultationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGeneralConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
